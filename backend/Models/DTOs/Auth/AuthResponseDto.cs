using backend.Models.Domain;

namespace backend.Models.DTOs.Auth
{
    public class AuthResponseDto
    {
        public required UserProfile User { get; set; }
        public string? Message { get; set; }
    }
}