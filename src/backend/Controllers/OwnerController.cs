using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BDogs.Models;
using Microsoft.Extensions.Logging;

namespace BDogs.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OwnerController : ControllerBase
    {
        private readonly DogDbContext _context;
        private readonly ILogger<OwnerController> _logger;

        public OwnerController(DogDbContext context, ILogger<OwnerController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Owner>>> GetOwners()
        {
            return await _context.Owners.Include(o => o.Dogs).ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Owner>> GetOwner(int id)
        {
            var owner = await _context.Owners
                .Include(o => o.Dogs)
                .FirstOrDefaultAsync(o => o.OwnerID == id);

            if (owner == null)
                return NotFound();

            return owner;
        }

        [HttpPost]
        public async Task<ActionResult<Owner>> CreateOwner([FromBody] Owner owner)
        {
            _context.Owners.Add(owner);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOwner), new { id = owner.OwnerID }, owner);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOwner(int id, [FromBody] Owner owner)
        {
            if (id != owner.OwnerID)
                return BadRequest();

            _context.Entry(owner).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Owners.Any(e => e.OwnerID == id))
                    return NotFound();

                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOwner(int id)
        {
            var owner = await _context.Owners.FindAsync(id);

            if (owner == null)
                return NotFound();

            _context.Owners.Remove(owner);
            await _context.SaveChangesAsync();

            return Ok(owner);
        }
    }
}
