namespace BDogs.Models
{
    public class Treatment
    {
        public int TreatmentID { get; set; }
        public string? Description { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public double Cost { get; set; }
        public int DogID { get; set; }
        public Dog? Dog { get; set; }
    }
}