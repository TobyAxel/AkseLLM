namespace backend.Models.Common
{
    public class Message
    {
        public required string Role { get; set; }
        public required string Content { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}