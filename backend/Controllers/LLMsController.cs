using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LLMsController : ControllerBase
    {
        private readonly ILLMsService _llmsService;

        public LLMsController(ILLMsService llmsService)
        {
            _llmsService = llmsService;
        }

        [HttpPost("")]
        /*
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            AuthResponseDto result = await _authService.RegisterAsync(registerDto);
            return Ok(result);
        }
        */
    }
}