namespace backend.Models.Common
{
    public class LLMModel
    {
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required LLMConfig Config { get; set; }
        public List<Message>? ChatHistory { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}