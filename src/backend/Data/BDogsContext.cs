using Microsoft.EntityFrameworkCore;
using BDogs.Models;

namespace BDogs
{
    public class DogDbContext : DbContext
    {
        public DogDbContext(DbContextOptions<DogDbContext> options) : base(options) { }

        public DbSet<Dog> Dogs { get; set; }
        public DbSet<Treatment> Treatments { get; set; }
    }
}
