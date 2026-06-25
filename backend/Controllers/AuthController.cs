using backend.Helpers;
using backend.Models.DTOs.Auth;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            var (authResponseDto, token, refreshToken) = await _authService.RegisterAsync(registerDto);

            // Store tokens in HttpOnly cookies so they're never accessible via JS
            Response.Cookies.Append("token", token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });
            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });

            return Ok(authResponseDto);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var (authResponseDto, token, refreshToken) = await _authService.LoginAsync(loginDto);

            // Store tokens in HttpOnly cookies so they're never accessible via JS
            Response.Cookies.Append("token", token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });
            Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });

            return Ok(authResponseDto);
        }

        [HttpGet("me")]
        public async Task<ActionResult<AuthResponseDto>> GetCurrentUser()
        {
            var (token, refreshToken) = CookieHelper.GetTokensFromCookies(Request.Cookies);
            AuthResponseDto authResponseDto = await _authService.GetCurrentUserAsync(token, refreshToken);
            return Ok(authResponseDto);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var (token, refreshToken) = CookieHelper.GetTokensFromCookies(Request.Cookies);
            await _authService.LogoutAsync(token, refreshToken);

            // Clear cookies from the client after invalidating the session server-side
            Response.Cookies.Delete("token");
            Response.Cookies.Delete("refreshToken");

            return NoContent();
        }
    }
}