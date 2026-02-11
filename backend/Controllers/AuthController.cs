using backend.Models.DTOs;
using backend.Services;
using Microsoft.AspNetCore.Mvc;
using Sprache;
using Supabase.Storage;

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
            try 
            {
                AuthResponseDto result = await _authService.RegisterAsync(registerDto);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new AuthResponseDto {
                    Message = e.Message,
                    Success = false
                });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try 
            {
                AuthResponseDto result = await _authService.LoginAsync(loginDto);
                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new AuthResponseDto {
                    Message = e.Message,
                    Success = false
                });
            }
        }
    }
}