using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BDogs.Models;

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
        public async Task<IActionResult> AddDog(Dog newDog)
        {
            newDog.DogID = 0;
            _context.Dogs.Add(newDog);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = newDog.DogID }, newDog);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDog(int id, Dog updatedDog)
        {
            if (id != updatedDog.DogID)
            {
                return BadRequest("Dog ID mismatch");
            }

            var existingDog = await _context.Dogs.FindAsync(id);
            if (existingDog is null)
            {
                return NotFound();
            }

            existingDog.Name = updatedDog.Name;
            existingDog.Race = updatedDog.Race;
            existingDog.Age = updatedDog.Age;
            existingDog.Weight = updatedDog.Weight;
            existingDog.OwnerID = updatedDog.OwnerID;

            //_context.Entry(existingDog).State = EntityState.Modified;
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
            _context.Dogs.Remove(deleteDog);
            await _context.SaveChangesAsync();
            return Ok(deleteDog);
        }
        
    }
}