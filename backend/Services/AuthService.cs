using backend.Helpers;
using backend.Models;
using backend.Models.DTOs;
using Supabase;
using Supabase.Gotrue;
using Supabase.Postgrest.Exceptions;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        public async Task<AuthResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            registerDto.Username = registerDto.Username.Trim();     

            // Validate fields
            ValidateUsername(registerDto.Username);
            ValidatePassword(registerDto.Password);

            var supabase = await SupabaseHelper.GetClientAsync();

            // Sign up user
            var signUpResponse = await supabase.Auth.SignUp(
                registerDto.Email, 
                registerDto.Password
            );

            if (signUpResponse?.User == null)
            {
                throw new Exception("Registration failed");
            }
    
            var response = new AuthResponseDto 
            {
                Token = signUpResponse.AccessToken,
                UserProfile = new ProfileDto{
                    Id = signUpResponse.User.Id!,
                    Username = "user134",
                    Email = signUpResponse.User.Email!,
                    Plan = "free",
                    CreatedAt = signUpResponse.User.CreatedAt
                },
                Message = "Registration successful"
            };

            return response;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            var supabase = await SupabaseHelper.GetClientAsync();

            // Sign in user
            var signInResponse = await supabase.Auth.SignIn(
                loginDto.Email,
                loginDto.Password
            );

            if (signInResponse?.User == null) 
            {
                throw new Exception("Login failed - Invalid Credentials");
            }
  
            var response = new AuthResponseDto 
            {
                Token = signInResponse.AccessToken,
                UserProfile = new ProfileDto{
                    Id = signInResponse.User.Id!,
                    Username = "user134",
                    Email = signInResponse.User.Email!,
                    Plan = "free",
                    CreatedAt = signInResponse.User.CreatedAt
                },
                Message = "Login successful"
            };
            
            return response;
        }

        private void ValidateUsername(string username)
        {
            if (username.Length < 3 || username.Length > 20)
            {
                throw new Exception("Username must be 3-20 characters");
            }
            
            if (!username.All(c => char.IsLetterOrDigit(c) || c == '_'))
            {
                throw new Exception("Username can only contain letters, numbers, and underscores");
            }
        }
        
        private void ValidatePassword(string password)
        {
            if (password.Length < 8)
            {
                throw new Exception("Password must be at least 8 characters");
            }
            
            if (!password.Any(char.IsUpper))
            {
                throw new Exception("Password must contain at least one uppercase letter");
            }
            
            if (!password.Any(char.IsLower))
            {
                throw new Exception("Password must contain at least one lowercase letter");
            }
            
            if (!password.Any(char.IsDigit))
            {
                throw new Exception("Password must contain at least one number");
            }
            
            if (!password.Any(c => !char.IsLetterOrDigit(c)))
            {
                throw new Exception("Password must contain at least one special character");
            }
        }
    }
}
