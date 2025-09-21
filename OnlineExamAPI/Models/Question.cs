using System.ComponentModel.DataAnnotations;

namespace OnlineExamAPI.Models
{
    public class Question
    {
        public int Id { get; set; }
        
        [Required]
        public string? Text { get; set; }
        
        [Required]
        public string? Type { get; set; }
        
        [Required]
        [Range(1, 100)]
        public int Points { get; set; }
        
        [Required]
        public int ExamId { get; set; }
        
        public string OptionsJson { get; set; } = "[]"; // Solo guardar como JSON
        
        public string? CorrectAnswer { get; set; }

    }
}