using System.ComponentModel.DataAnnotations;

namespace backend.Models.Common
{
    public class Message
    {
        [Required]
        public required int Id { get; set; }
        [Required]
        [RegularExpression("^(user|assistant|system)$")]
        public required string Role { get; set; }
        [Required]
        public required string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}