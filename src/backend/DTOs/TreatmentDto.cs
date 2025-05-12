namespace BDogs.Models
{
    public class TreatmentDto
    {
        public string? Description { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public double Cost { get; set; }
        public int DogID { get; set; }
    }
}