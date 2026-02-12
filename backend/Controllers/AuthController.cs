using System.Security.Claims;
using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Supabase.Postgrest.Exceptions;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
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

        [HttpGet("me")]
        public async Task<ActionResult<ProfileDto>> GetCurrentUser([FromHeader(Name = "Authorization")] string authorization)
        {
            if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            {
                return Unauthorized(new { message = "Authorization header is missing or invalid" });
            }

            string token = authorization.Substring("Bearer ".Length).Trim();
            ProfileDto user = await _authService.GetCurrentUserAsync(token);

            if (user == null)
            {
                return NotFound(new { message = "Invalid token" });
            }

            return Ok(user);
        }
    }
}