using System.ComponentModel.DataAnnotations;
using backend.Models.Domain;

namespace backend.Models.DTOs.LLM
{
    public class UpdateLLMDto
    {
        [Required]   
        public required string Id { get; set; }
        public string? Name { get; set; }
        public LLMConfig? Config { get; set; }
    }
}