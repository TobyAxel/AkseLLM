namespace backend.Models.DTOs.LLM
{
    public class LLMResponseDto
    {
        public required IEnumerable<LLM> LLMs { get; set; }
        public string? Message { get; set; }
    }
}