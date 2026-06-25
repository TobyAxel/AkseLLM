using System.ComponentModel.DataAnnotations;

namespace backend.Models.Common
{
    public class UserProfile
    {
        [Required]
        public required string Id { get; set; }
        [Required]
        public required string Username { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Plan { get; set; }
        public required DateTime CreatedAt { get; set; }
    }
}