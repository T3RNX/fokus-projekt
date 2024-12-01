using System.ComponentModel.DataAnnotations;

namespace BDogs.Models
{
    public class Dog
    {
        [Key]
        public int DogID { get; set; }
        public required string Name { get; set; }
        public int Age { get; set; }
        public required string Race { get; set; }
        public double Weight { get; set; }
        public int OwnerID { get; set; }
    }
}
