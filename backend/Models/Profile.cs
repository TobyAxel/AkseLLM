namespace backend.Models
{
    public class Profile
    {
        public required string Username { get; set; }
        public required string Plan { get; set; }
        public required DateTime CreatedAt { get; set; }
    }
}