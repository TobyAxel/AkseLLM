namespace backend.Models.DTOs
{
    public class CreateLLMDto
    {
        public string Name { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public InferenceConfig? InferenceConfig { get; set; }
    }
}