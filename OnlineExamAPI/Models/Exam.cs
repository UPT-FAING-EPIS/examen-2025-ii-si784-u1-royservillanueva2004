using System.ComponentModel.DataAnnotations;

namespace OnlineExamAPI.Models
{
    public class Exam
    {
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string? Title { get; set; }
        
        public string? Description { get; set; }
        
        [Required]
        [Range(1, 480)]
        public int Duration { get; set; }
        
        public DateTime CreatedDate { get; set; }
        
        public string? CreatedBy { get; set; }
        
        public List<Question> Questions { get; set; } = new List<Question>();
    }
}