using System.ComponentModel.DataAnnotations;
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
            // Trim and validate fields
            registerDto.Username = registerDto.Username.Trim();     
            ValidateUsername(registerDto.Username);
            ValidatePassword(registerDto.Password);

            // Connect to Supabase and attempt to sign up user
            var supabase = await SupabaseHelper.GetClientAsync();

            var signUpOptions = new SignUpOptions
            {
                Data = new Dictionary<string, object>
                {
                    { "display_name", registerDto.Username },
                    { "plan", "free" }
                }
            };

            await supabase.Auth.SignUp(
                registerDto.Email,
                registerDto.Password, 
                signUpOptions
            );

            // Sign user in immediately after registration
            var signInResponse = await supabase.Auth.SignIn(
                registerDto.Email,
                registerDto.Password
            );
            
            // Form response DTO and return
            var response = new AuthResponseDto 
            {
                Token = signInResponse!.AccessToken,
                User = new ProfileDto{
                    Id = signInResponse.User!.Id!,
                    Username = signInResponse.User.UserMetadata["display_name"].ToString()!,
                    Email = signInResponse.User.Email!,
                    Plan = signInResponse.User.UserMetadata["plan"].ToString()!,
                    CreatedAt = signInResponse.User.CreatedAt
                },
                Message = ""
            };

            return response;
        }

        public async Task<AuthResponseDto> LoginAsync(LoginDto loginDto)
        {
            // Connect to Supabase and attempt to sign in user
            var supabase = await SupabaseHelper.GetClientAsync();
            var signInResponse = await supabase.Auth.SignIn(
                loginDto.Email,
                loginDto.Password
            );
  
            // Form response DTO and return
            var response = new AuthResponseDto 
            {
                Token = signInResponse!.AccessToken,
                User = new ProfileDto{
                    Id = signInResponse.User!.Id!,
                    Username = signInResponse.User.UserMetadata["display_name"].ToString()!,
                    Email = signInResponse.User.Email!,
                    Plan = signInResponse.User.UserMetadata["plan"].ToString()!,
                    CreatedAt = signInResponse.User.CreatedAt
                },
                Message = ""
            };
            
            return response;
        }

        public async Task<ProfileDto> GetCurrentUserAsync(string token)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            var user = await supabase.Auth.GetUser(token);

            if (user == null)
            {
                throw new ValidationException("Invalid token");
            }

            return new ProfileDto
            {
                Id = user.Id!,
                Username = user.UserMetadata["display_name"].ToString()!,
                Email = user.Email!,
                Plan = user.UserMetadata["plan"].ToString()!,
                CreatedAt = user.CreatedAt
            };
        }

        private void ValidateUsername(string username)
        {
            if (username.Length < 3 || username.Length > 20)
            {
                throw new ValidationException("Username must be 3-20 characters");
            }
            
            if (!username.All(c => char.IsLetterOrDigit(c) || c == '_'))
            {
                throw new ValidationException("Username can only contain letters, numbers, and underscores");
            }
        }
        
        private void ValidatePassword(string password)
        {
            if (password.Length < 8)
            {
                throw new ValidationException("Password must be at least 8 characters");
            }
            
            if (!password.Any(char.IsUpper))
            {
                throw new ValidationException("Password must contain at least one uppercase letter");
            }
            
            if (!password.Any(char.IsLower))
            {
                throw new ValidationException("Password must contain at least one lowercase letter");
            }
            
            if (!password.Any(char.IsDigit))
            {
                throw new ValidationException("Password must contain at least one number");
            }
            
            if (!password.Any(c => !char.IsLetterOrDigit(c)))
            {
                throw new ValidationException("Password must contain at least one special character");
            }
        }
    }
}
