namespace backend.Models.DTOs
{
    public class ProfileDto
    {
        public required string Id { get; set; } = String.Empty;
        public required string Username { get; set; } = String.Empty;
        public required string Email { get; set; } = String.Empty;
        public required string Plan { get; set; } = String.Empty;
        public required DateTime CreatedAt { get; set; }
    };
}