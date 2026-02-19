using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models.SupaBaseModels
{
    [Table("llms")]
    public class LLM : BaseModel
    {
        [PrimaryKey("id", false)]
        public string? Id { get; set; }

        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("model")]
        public string Model { get; set; } = string.Empty;

        [Column("inference_config")]
        public string InferenceConfigJson { get; set; } = string.Empty;
    }
}