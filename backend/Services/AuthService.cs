using backend.Helpers;
using backend.Models.Domain;
using backend.Models.DTOs.Auth;
using Supabase.Gotrue;

namespace backend.Services
{
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

            var signInResponse = await supabase.Auth.SignIn(
                registerDto.Email,
                registerDto.Password
            );

            var response = new AuthResponseDto
            {
                User = new UserProfile
                {
                    Id = signInResponse!.User!.Id!,
                    Username = signInResponse.User.UserMetadata["display_name"].ToString()!,
                    Email = signInResponse.User.Email!,
                    Plan = signInResponse.User.UserMetadata["plan"].ToString()!,
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

            var response = new AuthResponseDto
            {
                User = new UserProfile
                {
                    Id = signInResponse!.User!.Id!,
                    Username = signInResponse.User.UserMetadata["display_name"].ToString()!,
                    Email = signInResponse.User.Email!,
                    Plan = signInResponse.User.UserMetadata["plan"].ToString()!,
                    CreatedAt = signInResponse.User.CreatedAt
                }
            };

            return (response, signInResponse.AccessToken!, signInResponse.RefreshToken!);
        }

        public async Task LogoutAsync(string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            await supabase.Auth.SignOut();
        }

        public async Task<AuthResponseDto> GetCurrentUserAsync(string token, string refreshToken)
        {
            var supabase = await SupabaseHelper.GetClientAsync();
            await supabase.Auth.SetSession(token, refreshToken);
            var user = supabase.Auth.CurrentUser;

            var response = new AuthResponseDto
            {
                User = new UserProfile
                {
                    Id = user!.Id!,
                    Username = user.UserMetadata["display_name"].ToString()!,
                    Email = user.Email!,
                    Plan = user.UserMetadata["plan"].ToString()!,
                    CreatedAt = user.CreatedAt
                }
            };

            return response;
        }
    }
}