namespace backend.Models.Common
{
    public class LLM
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required LLMConfig Config { get; set; }
        public string? ChatHistory { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}