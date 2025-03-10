using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [Column(TypeName = "varbinary(max)")]
        public byte[]? ImageData { get; set; }
        
        public string? ImageContentType { get; set; }

    }
}
