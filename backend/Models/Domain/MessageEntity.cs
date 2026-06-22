using backend.Models.Common;
using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models.Domain
{
    [Table("messages")]
    public class MessageEntity : BaseModel
    {
        [PrimaryKey("id", false)]
        public int Id { get; set; }

        [Column("role")]
        public string? Role { get; set; }

        [Column("content")]
        public string? Content { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        [Column("llm_id")]
        public int LLMId { get; set; }
    }
}