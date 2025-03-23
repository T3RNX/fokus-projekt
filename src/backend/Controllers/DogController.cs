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
        private readonly ILogger<DogController> _logger;

        public DogController(DogDbContext context, ILogger<DogController> logger)
        {
            _context = context;
            _logger = logger;
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
                    var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                    if (!allowedTypes.Contains(image.ContentType.ToLower()))
                    {
                        return BadRequest("Invalid file type. Only JPG, PNG and GIF are allowed.");
                    }

                    if (image.Length > 5 * 1024 * 1024)
                    {
                        return BadRequest("File size too large. Maximum size is 5MB.");
                    }

                    using (var ms = new MemoryStream())
                    {
                        await image.CopyToAsync(ms);
                        dog.ImageData = ms.ToArray();
                        dog.ImageContentType = image.ContentType;
                    }
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

        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var dog = await _context.Dogs.FindAsync(id);
            if (dog?.ImageData == null)
            {
                return NotFound();
            }
            return File(dog.ImageData, dog.ImageContentType ?? "image/png");
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
                var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(image.ContentType.ToLower()))
                {
                    return BadRequest("Invalid file type. Only JPG, PNG and GIF are allowed.");
                }
                if (image.Length > 5 * 1024 * 1024)
                {
                    return BadRequest("File size too large. Maximum size is 5MB.");
                }

                using (var ms = new MemoryStream())
                {
                    await image.CopyToAsync(ms);
                    existingDog.ImageData = ms.ToArray();
                    existingDog.ImageContentType = image.ContentType;
                }
            }

            await _context.SaveChangesAsync();
            return Ok(existingDog);
        }

        [HttpPut("{id}/description")]
        public async Task<IActionResult> UpdateDescription(int id, [FromBody] DescriptionUpdateDto dto)
        {
            var dog = await _context.Dogs.FindAsync(id);
            if (dog == null) return NotFound();

            dog.Description = dto.Description;
            await _context.SaveChangesAsync();
            return Ok(dog);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDog(int id)
        {
            var deleteDog = await _context.Dogs.FindAsync(id);
            if (deleteDog == null)
            {
                return NotFound();
            }

            _context.Dogs.Remove(deleteDog);
            await _context.SaveChangesAsync();
            return Ok(deleteDog);
        }
    }
}