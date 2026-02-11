using backend.Helpers;
using backend.Models;
using backend.Models.DTOs;
using Supabase;
using Supabase.Gotrue;

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

            // Check if username already exists in profiles table
            var existingProfile = await supabase
                .From<Profile>()
                .Where(x => x.Username == registerDto.Username)
                .Get();

            if (existingProfile.Models.Any())
            {
                throw new Exception("Username already exists");
            }

            // Sign up user
            var signUpResponse = await supabase.Auth.SignUp(
                registerDto.Email, 
                registerDto.Password
            );

            if (signUpResponse?.User == null)
            {
                throw new Exception("Registration failed");
            }

            var profile = await CreateProfile(supabase, signUpResponse.User, registerDto.Username);
    
            var response = new AuthResponseDto 
            {
                Token = signUpResponse.AccessToken,
                UserProfile = profile,
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

            // Fetch profile
            var profile = await supabase
                .From<Profile>()
                .Where(x => x.Id == signInResponse.User.Id)
                .Single();
            
            // If no profile found, create one now
            if (profile == null) 
            {
                profile = await CreateProfile(supabase, signInResponse.User);
            }

            var response = new AuthResponseDto 
            {
                Token = signInResponse.AccessToken,
                UserProfile = profile,
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
        private async Task<Profile> CreateProfile(Supabase.Client supabase, Supabase.Gotrue.User user, string? username = null)
        {
            // Create and return user's profile info
            var profile = new Profile 
            {
                Id = user.Id!,
                Username = username ?? user.Email!,
                Email = user.Email!,
                CreatedAt = user.CreatedAt
            };

            await supabase.From<Profile>().Insert(profile);

            return profile;
        }
    }
}