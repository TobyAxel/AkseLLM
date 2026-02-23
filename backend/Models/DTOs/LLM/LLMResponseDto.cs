using backend.Models.Common;

namespace backend.Models.DTOs.LLM
{
    public class LLMResponseDto
    {
        public required IEnumerable<LLMModel> LLMs { get; set; }
        public string? Message { get; set; }
    }
}