using backend.Helpers;
using backend.Models.DTOs;
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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LLMDto>>> GetAllLLMs(
            [FromHeader(Name = "Authorization")] string authorization,
            [FromHeader(Name = "X-Refresh-Token")] string refreshToken)
        {
            string? token = await HandleApiKeyHelper.HandleApiKey(authorization);
            if (token == null) return Unauthorized(new { message = "Authorization header is missing or invalid" });

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token is required" });

            IEnumerable<LLMDto> llms = await _llmsService.GetAllLLMsAsync(token, refreshToken);
            return Ok(llms);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LLMDto>> GetLLMById(
            string id, 
            [FromHeader(Name = "Authorization")] string authorization,
            [FromHeader(Name = "X-Refresh-Token")] string refreshToken)
        {
            string? token = await HandleApiKeyHelper.HandleApiKey(authorization);
            if (token == null) return Unauthorized(new { message = "Authorization header is missing or invalid" });

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token is required" });

            LLMDto llm = await _llmsService.GetLLMByIdAsync(id, token, refreshToken);

            if (llm == null) return NotFound(new { message = "LLM not found" });

            return Ok(llm);
        }

        [HttpPost]
        public async Task<ActionResult<LLMDto>> CreateLLM(
            [FromBody] CreateLLMDto createLLMDto, 
            [FromHeader(Name = "Authorization")] string authorization,
            [FromHeader(Name = "X-Refresh-Token")] string refreshToken)
        {
            string? token = await HandleApiKeyHelper.HandleApiKey(authorization);
            if (token == null) return Unauthorized(new { message = "Authorization header is missing or invalid" });

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token is required" });

            LLMDto llm = await _llmsService.CreateLLMAsync(createLLMDto, token, refreshToken);
            return Ok(llm);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLLM(
            string id, 
            [FromHeader(Name = "Authorization")] string authorization,
            [FromHeader(Name = "X-Refresh-Token")] string refreshToken)
        {
            string? token = await HandleApiKeyHelper.HandleApiKey(authorization);
            if (token == null) return Unauthorized(new { message = "Authorization header is missing or invalid" });

            if (string.IsNullOrEmpty(refreshToken))
                return BadRequest(new { message = "Refresh token is required" });

            await _llmsService.DeleteLLMAsync(id, token, refreshToken);
            return NoContent();
        }
    }
}