namespace backend.Models.DTOs
{
    public class LLMDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public InferenceConfig InferenceConfig { get; set; } = new InferenceConfig();
    }
}