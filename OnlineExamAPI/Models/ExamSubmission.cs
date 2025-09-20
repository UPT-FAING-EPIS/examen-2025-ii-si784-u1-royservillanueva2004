using System.ComponentModel.DataAnnotations;

namespace OnlineExamAPI.Models
{
    public class ExamSubmission
    {
        public int Id { get; set; }
        
        [Required]
        public int ExamId { get; set; }
        
        [Required]
        public string? StudentId { get; set; }
        
        public DateTime StartTime { get; set; }
        
        public DateTime? EndTime { get; set; }
        
        public Dictionary<int, string> Answers { get; set; } = new Dictionary<int, string>();
        
        public decimal Score { get; set; }
        
        public bool IsCompleted { get; set; }
    }
}