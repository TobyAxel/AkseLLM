using backend.Helpers;
using backend.Models.Common;
using backend.Models.Domain;
using backend.Models.DTOs.Auth;
using Supabase.Gotrue;
using backend.Exceptions;
using System.Collections.Generic;

namespace backend.Services
{
    // Defines authentication operations: register, login, logout, and session retrieval
    public interface IAuthService
    {
        Task<(AuthResponseDto user, string token, string refreshToken)> RegisterAsync(RegisterDto registerDto);
        Task<(AuthResponseDto user, string token, string refreshToken)> LoginAsync(LoginDto loginDto);
        Task LogoutAsync(string token, string refreshToken);
        Task<AuthResponseDto> GetCurrentUserAsync(string token, string refreshToken);
    }

    public class AuthService : IAuthService
    {
        public async Task<(AuthResponseDto user, string token, string refreshToken)> RegisterAsync(RegisterDto registerDto)
        {
            // Trim whitespace from username before validation
            registerDto.Username = registerDto.Username.Trim();
            ValidateUsername(registerDto.Username);
            ValidatePassword(registerDto.Password);

            var supabase = await SupabaseHelper.GetClientAsync();

            // Attach display name and default plan to the user's metadata at sign-up
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

            // Sign in immediately after registration to obtain a session token
            var signInResponse = await supabase.Auth.SignIn(
                registerDto.Email,
                registerDto.Password
            );

            if (signInResponse?.User == null)
                throw new ValidationException("Failed to sign in after registration");

            // Extract user profile fields from Supabase metadata
            var metadata = signInResponse.User.UserMetadata;
            metadata.TryGetValue("display_name", out var dnObj);
            metadata.TryGetValue("plan", out var planObj);

            var response = new AuthResponseDto
            {
                User = new UserProfile
                {
                    Id = signInResponse.User.Id!,
                    Username = dnObj!.ToString()!,
                    Email = signInResponse.User.Email!,
                    Plan = planObj!.ToString()!,
                    CreatedAt = signInResponse.User.CreatedAt
                }
            };

            return (response, signInResponse.AccessToken!, signInResponse.RefreshToken!);
        }

        public async Task<(AuthResponseDto user, string token, string refreshToken)> LoginAsync(LoginDto loginDto)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            var signInResponse = await supabase.Auth.SignIn(
                loginDto.Email,
                loginDto.Password
            );

            if (signInResponse?.User == null)
                throw new ValidationException("Invalid credentials");

            // Extract user profile fields from Supabase metadata
            var metadata = signInResponse.User.UserMetadata;
            metadata.TryGetValue("display_name", out var dnObj);
            metadata.TryGetValue("plan", out var planObj);

            var response = new AuthResponseDto
            {
                User = new UserProfile
                {
                    Id = signInResponse.User.Id!,
                    Username = dnObj!.ToString()!,
                    Email = signInResponse.User.Email!,
                    Plan = planObj!.ToString()!,
                    CreatedAt = signInResponse.User.CreatedAt
                }
            };

            return (response, signInResponse.AccessToken!, signInResponse.RefreshToken!);
        }

        public async Task LogoutAsync(string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();

            // Restore the session so Supabase knows which user to sign out
            await supabase.Auth.SetSession(token, refreshToken);
            await supabase.Auth.SignOut();
        }

        public async Task<AuthResponseDto> GetCurrentUserAsync(string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();

            // Restore the session to make the current user available
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            if (user == null)
                throw new UnauthorizedAccessException("Invalid session");

            // Extract user profile fields from Supabase metadata
            var metadata = user.UserMetadata;
            metadata.TryGetValue("display_name", out var dnObj);
            metadata.TryGetValue("plan", out var planObj);

            var response = new AuthResponseDto
            {
                User = new UserProfile
                {
                    Id = user.Id!,
                    Username = dnObj!.ToString()!,
                    Email = user.Email!,
                    Plan = planObj!.ToString()!,
                    CreatedAt = user.CreatedAt
                }
            };

            return response;
        }

        private void ValidateUsername(string username)
        {
            if (username.Length < 3 || username.Length > 20)
                throw new ValidationException("Username must be 3-20 characters");

            if (!username.All(c => char.IsLetterOrDigit(c) || c == '_'))
                throw new ValidationException("Username can only contain letters, numbers, and underscores");
        }

        private void ValidatePassword(string password)
        {
            if (password.Length < 8)
                throw new ValidationException("Password must be at least 8 characters");

            if (!password.Any(char.IsUpper))
                throw new ValidationException("Password must contain at least one uppercase letter");

            if (!password.Any(char.IsLower))
                throw new ValidationException("Password must contain at least one lowercase letter");

            if (!password.Any(char.IsDigit))
                throw new ValidationException("Password must contain at least one number");

            if (!password.Any(c => !char.IsLetterOrDigit(c)))
                throw new ValidationException("Password must contain at least one special character");
        }
    }
}