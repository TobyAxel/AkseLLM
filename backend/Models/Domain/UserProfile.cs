namespace backend.Models.Domain
{
    public class UserProfile
    {
        public required string Id { get; set; }
        public required string Username { get; set; }
        public required string Email { get; set; }
        public required string Plan { get; set; }
        public required DateTime CreatedAt { get; set; }
    }
}