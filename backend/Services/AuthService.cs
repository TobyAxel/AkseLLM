using backend.Models;
using backend.Models.DTOs;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            return new AuthResponseDto
            {
                Token = "dummy-token-register",
                UserProfile = new Profile{
                    Username = "TestUser",
                    Plan = "free",
                    CreatedAt = DateTime.Now,
                },
                Message = "This works"
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            return new AuthResponseDto
            {
                Token = "dummy-token-login",
                UserProfile = new Profile{
                    Username = "TestUser",
                    Plan = "free",
                    CreatedAt = DateTime.Now,
                },
                Message = "This works"
            };
        }
    }
}