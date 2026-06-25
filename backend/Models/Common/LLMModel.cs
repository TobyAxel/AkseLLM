using System.ComponentModel.DataAnnotations;

namespace backend.Models.Common
{
    public class LLMModel
    {
        [Required]
        public required int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required LLMConfig Config { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}