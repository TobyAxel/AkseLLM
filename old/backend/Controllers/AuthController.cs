using backend.Helpers;
using backend.Models.DTOs;
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
            AuthResponseDto result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            AuthResponseDto result = await _authService.LoginAsync(loginDto);
            return Ok(result);
        }

        [HttpPost("logout")]
        public async Task<ActionResult<AuthResponseDto>> Logout()
        {
            AuthResponseDto result = await _authService.LogoutAsync();
            return Ok(result);
        }

        [HttpGet("me")]
        public async Task<ActionResult<ProfileDto>> GetCurrentUser(
            [FromHeader(Name = "Authorization")] string authorization,
            [FromHeader(Name = "X-Refresh-Token")] string refreshToken)
        {
            string? token = await HandleApiKeyHelper.HandleApiKey(authorization);
            if (token == null) return Unauthorized(new { message = "Authorization header is missing or invalid" });

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token is required" });

            ProfileDto user = await _authService.GetCurrentUserAsync(token, refreshToken);
            if (user == null) return NotFound(new { message = "Invalid token" });
            return Ok(user);
        }
    }
}