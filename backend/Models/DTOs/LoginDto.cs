namespace backend.Models.DTOs
{
    public class LoginDto
    {
        public required string EmailOrUsername { get; set; }
        public required string Password { get; set; }
    }
}