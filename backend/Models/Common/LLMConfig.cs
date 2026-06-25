using System.ComponentModel.DataAnnotations;
using backend.Validation;

namespace backend.Models.Common
{
    public class LLMConfig
    {
        [Required]
        public required LLMProvider Provider { get; set; }
        [Required]
        [ValidModelForProvider]
        public required string Model { get; set; }
        [Required]
        public double Temperature { get; set; } = 0.7f; // Randomness
        [Required]
        public int MaxTokens { get; set; } = 200; // Response Length (1 token ~ 4 char)
        public string? SystemPrompt { get; set;} // Text at start of prompt
        public double? TopP { get; set; } // From what top % of words to take from
        public int? TopK { get; set; } // From what top x words to take from
        public double? FrequencyPenalty { get; set; } // Discourage same words
        public double? PresencePenalty { get; set; } // Discourage same topics
        public double? RepeatPenalty { get; set; } // Discourage repeating words
        public int? Seed { get; set; }
        public bool Stream { get; set; } = true; // Send response back in realtime
        public string[]? StopSequences { get; set; } // Words that end generation
    }
}