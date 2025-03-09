namespace BDogs.Models
{
    public class DogCreateDto
    {
        public required string Name { get; set; }
        public int Age { get; set; }
        public required string Race { get; set; }
        public double Weight { get; set; }
        public int OwnerID { get; set; }
    }
}