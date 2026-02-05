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
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            return new AuthResponseDto
            {
                Token = "dummy-token-login",
            };
        }
    }
}