namespace backend.Models.DTOs
{
    public class InferenceConfig
    {
        public float Temperature { get; set; } = 0.7f;
        public int MaxTokens { get; set; } = 512;
        public float TopP { get; set; } = 0.9f;
        public int TopK { get; set; } = 40;
        public float RepetitionPenalty { get; set; } = 1.1f;
        public int? Seed { get; set; }
    }
}