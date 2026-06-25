using System.ComponentModel.DataAnnotations;
using backend.Models.Common;

namespace backend.Models.DTOs.LLM
{
    public class LLMResponseDto
    {
        [Required]
        public required IEnumerable<LLMModel> LLMs { get; set; }
        public string? Message { get; set; }
    }
}