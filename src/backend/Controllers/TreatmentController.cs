using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BDogs.Models;
using Microsoft.Extensions.Logging;

namespace BDogs.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class TreatmentController : ControllerBase
    {
        private readonly DogDbContext _context;
        private readonly ILogger<TreatmentController> _logger;

        public TreatmentController(DogDbContext context, ILogger<TreatmentController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<Treatment>> Get()
        {
            return await _context.Treatments.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Treatment>> GetTreatmentById(int id)
        {
            var treatment = await _context.Treatments.FindAsync(id);
            if (treatment == null)
            {
                return NotFound();
            }

            return Ok(treatment);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTreatment([FromBody] Treatment treatment)
        {
            if (!_context.Dogs.Any(d => d.DogID == treatment.DogID))
            {
                return BadRequest("Invalid DogID. The specified dog does not exist.");
            }

            _context.Treatments.Add(treatment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTreatmentById), new { id = treatment.TreatmentID }, treatment);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTreatment(int id)
        {
            var deleteTreatment = await _context.Treatments.FindAsync(id);
            if (deleteTreatment == null)
            {
                return NotFound();
            }

            _context.Treatments.Remove(deleteTreatment);
            await _context.SaveChangesAsync();
            return Ok(deleteTreatment);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTreatment(int id, [FromBody] TreatmentDto dto)
        {
            var treatment = await _context.Treatments.FindAsync(id);
            if (treatment == null) return NotFound();

            treatment.Description = dto.Description;
            treatment.Date = dto.Date;
            treatment.Time = dto.Time;
            treatment.Cost = dto.Cost;
            treatment.DogID = dto.DogID;

            await _context.SaveChangesAsync();
            return Ok(treatment);
        }

        [HttpPatch("{id}")]
        public async Task<IActionResult> PatchTreatment(int id, [FromBody] TreatmentDto dto)
        {
            var treatment = await _context.Treatments.FindAsync(id);
            if (treatment == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrWhiteSpace(dto.Description))
            {
                treatment.Description = dto.Description;
            }

            if (dto.Date != default)
            {
                treatment.Date = dto.Date;
            }

            if (dto.Time != default)
            {
                treatment.Time = dto.Time;
            }

            if (dto.Cost > 0)
            {
                treatment.Cost = dto.Cost;
            }

            if (dto.DogID > 0)
            {
                treatment.DogID = dto.DogID;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
