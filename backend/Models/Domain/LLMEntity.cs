using System.ComponentModel.DataAnnotations;
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

        [Required]
        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;
        [Required]
        [Column("name")]
        public string Name { get; set; } = string.Empty;
        [Required]
        [Column("llm_config")]
        public LLMConfig LLMConfig { get; set; } = null!;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}