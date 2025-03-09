using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BDogs.Models;
using BDogs.Services;
using Microsoft.Extensions.Logging;

namespace BDogs.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DogController : ControllerBase
    {
        private readonly DogDbContext _context;
        private readonly ImageService _imageService;
        private readonly ILogger<DogController> _logger;

        public DogController(DogDbContext context, ILogger<DogController> logger, ImageService imageService)
        {
            _context = context;
            _logger = logger;
            _imageService = imageService;
        }

        [HttpGet]
        public async Task<IEnumerable<Dog>> Get()
        {
            return await _context.Dogs.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Dog>> GetDogById(int id)
        {
            var dog = await _context.Dogs.FindAsync(id);
            if (dog == null)
            {
                return NotFound();
            }
            return Ok(dog);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDog([FromForm] DogCreateDto dogDto, IFormFile? image)
        {
            try
            {
                var dog = new Dog
                {
                    Name = dogDto.Name,
                    Age = dogDto.Age,
                    Race = dogDto.Race,
                    Weight = dogDto.Weight,
                    OwnerID = dogDto.OwnerID
                };

                if (image != null)
                {
                    // Validate file type
                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                    if (!allowedTypes.Contains(image.ContentType.ToLower()))
                    {
                        return BadRequest("Invalid file type. Only JPG, PNG and GIF are allowed.");
                    }

                    // Validate file size (e.g. max 5MB)
                    if (image.Length > 5 * 1024 * 1024)
                    {
                        return BadRequest("File size too large. Maximum size is 5MB.");
                    }

                    // Save image to file system
                    var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                    var path = Path.Combine(_imageService.GetImageDirectory(), fileName);

                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    dog.ImagePath = fileName;
                }

                _context.Dogs.Add(dog);
                await _context.SaveChangesAsync();

                return Ok(dog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating dog");
                return StatusCode(500, "An error occurred while creating the dog");
            }
        }

        [HttpGet("image/{filename}")]
        public IActionResult GetImage(string filename)
        {
            var path = Path.Combine(_imageService.GetImageDirectory(), filename);
            if (!System.IO.File.Exists(path))
                return NotFound();

            var contentType = GetContentType(Path.GetExtension(filename));
            return PhysicalFile(path, contentType);
        }

        private string GetContentType(string extension)
        {
            return extension.ToLower() switch
            {
                ".jpg" or ".jpeg" => "image/jpeg",
                ".png" => "image/png",
                ".gif" => "image/gif",
                _ => "application/octet-stream"
            };
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDog(int id, [FromForm] DogCreateDto dogDto, IFormFile? image)
        {
            var existingDog = await _context.Dogs.FindAsync(id);
            if (existingDog is null)
            {
                return NotFound();
            }

            existingDog.Name = dogDto.Name;
            existingDog.Race = dogDto.Race;
            existingDog.Age = dogDto.Age;
            existingDog.Weight = dogDto.Weight;
            existingDog.OwnerID = dogDto.OwnerID;

            if (image != null)
            {
                // Delete old image if exists
                if (!string.IsNullOrEmpty(existingDog.ImagePath))
                {
                    var oldImagePath = Path.Combine(_imageService.GetImageDirectory(), existingDog.ImagePath);
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                // Save new image
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
                var path = Path.Combine(_imageService.GetImageDirectory(), fileName);

                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                existingDog.ImagePath = fileName;
            }

            await _context.SaveChangesAsync();
            return Ok(existingDog);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDog(int id)
        {
            var deleteDog = await _context.Dogs.FindAsync(id);
            if (deleteDog == null)
            {
                return NotFound();
            }

            // Delete the image file if it exists
            if (!string.IsNullOrEmpty(deleteDog.ImagePath))
            {
                var imagePath = Path.Combine(_imageService.GetImageDirectory(), deleteDog.ImagePath);
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            _context.Dogs.Remove(deleteDog);
            await _context.SaveChangesAsync();
            return Ok(deleteDog);
        }
    }
}