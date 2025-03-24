using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BDogs.Models;
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
                using var timeoutCts = new CancellationTokenSource(TimeSpan.FromMinutes(5));

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
                    try
                    {
                        var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                        if (!allowedTypes.Contains(image.ContentType.ToLower()))
                        {
                            return BadRequest("Invalid file type. Only JPG, PNG and GIF are allowed.");
                        }
                        if (image.Length > 2 * 1024 * 1024) // 2MB limit
                        {
                            return BadRequest("File size too large. Maximum size is 2MB.");
                        }

                        using (var ms = new MemoryStream())
                        {
                            await image.CopyToAsync(ms, timeoutCts.Token);
                            var imageBytes = ms.ToArray();
                            _logger.LogInformation($"Image processed. Size: {imageBytes.Length} bytes");

                            dog.ImageData = imageBytes;
                            dog.ImageContentType = image.ContentType;
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogError("Image processing timed out");
                        return StatusCode(408, "Request timeout while processing image");
                    }
                    catch (Exception imageEx)
                    {
                        _logger.LogError(imageEx, "Error processing image: {Message}", imageEx.Message);
                        return StatusCode(500, "Error processing image: " + imageEx.Message);
                    }
                }

                try
                {
                    _context.Dogs.Add(dog);
                    await _context.SaveChangesAsync(timeoutCts.Token);

                    _logger.LogInformation($"Dog created successfully with ID: {dog.DogID}");
                    return Ok(dog);
                }
                catch (Exception dbEx)
                {
                    _logger.LogError(dbEx, "Database error when saving dog: {Message}", dbEx.Message);
                    return StatusCode(500, "Database error: " + dbEx.Message);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception in CreateDog: {Message}", ex.Message);
                return StatusCode(500, "An unexpected error occurred: " + ex.Message);
            }
        }

        [HttpPost("upload-image/{id}")]
        public async Task<IActionResult> UploadImage(int id, IFormFile file)
        {
            try
            {
                var dog = await _context.Dogs.FindAsync(id);
                if (dog == null) return NotFound();

                var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
                if (!allowedTypes.Contains(file.ContentType.ToLower()))
                {
                    return BadRequest("Invalid file type. Only JPG, PNG and GIF are allowed.");
                }

                if (file.Length > 5 * 1024 * 1024) // 5MB limit
                {
                    return BadRequest("File size too large. Maximum size is 5MB.");
                }

                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    dog.ImageData = memoryStream.ToArray();
                    dog.ImageContentType = file.ContentType;
                }

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("image/{id}")]
        public async Task<IActionResult> GetImage(int id)
        {
            var dog = await _context.Dogs.FindAsync(id);
            if (dog == null || dog.ImageData == null)
                return NotFound();

            return File(dog.ImageData, dog.ImageContentType ?? "application/octet-stream");
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