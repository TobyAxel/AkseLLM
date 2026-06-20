using backend.Models.Common;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models.Domain
{
    [Table("llms")]
    public class LLMEntity : BaseModel
    {
        [PrimaryKey("id", false)]
        public int Id { get; set; }

        [Column("user_id")]
        public string? UserId { get; set; }

        [Column("name")]
        public string? Name { get; set; }

        [Column("llm_config")]
        public LLMConfig? LLMConfig { get; set; }

        [Column("chat_history")]
        public List<Message>? ChatHistory { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}