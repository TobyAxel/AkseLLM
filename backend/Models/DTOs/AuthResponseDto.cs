namespace backend.Models.DTOs
{
    public class AuthResponseDto
    {
        public string? Token { get; set; }
        public string? RefreshToken { get; set; }
        public ProfileDto? User { get; set; }
        public required string Message { get; set; }
    }
}