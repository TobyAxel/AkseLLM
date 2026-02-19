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
            var result = await _authService.RegisterAsync(registerDto);

            Response.Cookies.Append("token", result.token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });
            Response.Cookies.Append("refreshToken", result.refreshToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });

            return Ok(result.user);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);

            Response.Cookies.Append("token", result.token, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });
            Response.Cookies.Append("refreshToken", result.refreshToken, new CookieOptions { HttpOnly = true, Secure = true, SameSite = SameSiteMode.Strict });

            return Ok(result.user);
        }

        [HttpGet("me")]
        public async Task<ActionResult<AuthResponseDto>> GetCurrentUser()
        {
            var (token, refreshToken) = CookieHelper.GetTokensFromCookies(Request.Cookies);
            AuthResponseDto result = await _authService.GetCurrentUserAsync(token, refreshToken);

            return Ok(result);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var (token, refreshToken) = CookieHelper.GetTokensFromCookies(Request.Cookies);

            await _authService.LogoutAsync(token, refreshToken);

            Response.Cookies.Delete("token");
            Response.Cookies.Delete("refreshToken");

            return NoContent();
        }
    }
}