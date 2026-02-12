namespace backend.Models.DTOs
{
    public class AuthResponseDto
    {
        public string? Token { get; set; }
        public ProfileDto? UserProfile { get; set; }
        public required string Message { get; set; }
        public bool Success { get; set; } = true;
    }
}