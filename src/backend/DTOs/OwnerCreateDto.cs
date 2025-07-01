namespace BDogs.Models
{
    public class OwnerCreateDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public string? AlternativePhone { get; set; }
        public required string Address { get; set; }
        public required string City { get; set; }
        public required string PostalCode { get; set; }
        public DateTime? LastVisit { get; set; }
        public required string Country { get; set; }
    }
}