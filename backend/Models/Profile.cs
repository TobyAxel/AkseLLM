using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace backend.Models
{
    [Table("profiles")]
    public class Profile : BaseModel
    {
        [PrimaryKey("id")]
        public string Id { get; set; } = String.Empty;

        [Column("username")]
        public string Username { get; set; } = String.Empty;

        [Column("email")]
        public string Email { get; set; } = String.Empty;

        [Column("plan")]
        public string Plan { get; set; } = "free";

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }
    }
}