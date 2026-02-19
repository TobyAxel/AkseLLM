using System.ComponentModel.DataAnnotations;
using backend.Models.Domain;

namespace backend.Models.DTOs.LLM
{
    public class CreateLLMDto
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required LLMConfig Config { get; set; }
    }
}