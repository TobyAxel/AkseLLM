using System.ComponentModel.DataAnnotations;
using backend.Models.Common;

namespace backend.Models.DTOs.LLM
{
    public class UpdateLLMDto
    {
        [Required]   
        public required int Id { get; set; }
        public string? Name { get; set; }
        public LLMConfig? Config { get; set; }
    }
}