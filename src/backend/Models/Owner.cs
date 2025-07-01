using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BDogs.Models
{
    public class Owner
    {
        [Key]
        public int OwnerID { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public string? AlternativePhone { get; set; }
        public required string Address { get; set; }
        public required string City { get; set; }
        public required string PostalCode { get; set; }
        public string? Country { get; set; }
        public DateTime? LastVisit { get; set; }
        public ICollection<Dog> Dogs { get; set; } = new List<Dog>();
    }
}