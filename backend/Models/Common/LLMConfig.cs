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

        public float Temperature { get; set; } = 0.7f; // Randomness
        public int MaxTokens { get; set; } = 200; // Response Length (1 token ~ 4 char)
        public string? SystemPrompt { get; set;} // Text at start of prompt

        public float? TopP { get; set; } // From what top % of words to take from
        public int? TopK { get; set; } // From what top x words to take from
        
        public float? FrequencyPenalty { get; set; } // Discourage same words
        public float? PresencePenalty { get; set; } // Discourage same topics

        public float? RepeatPenalty { get; set; } // Discourage repeating words
        public int? Seed { get; set; }

        public bool Stream { get; set; } = true; // Send response back in realtime
        public string[]? StopSequences { get; set; } // Words that end generation
    }
}