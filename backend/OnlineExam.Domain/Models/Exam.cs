// Exam.cs
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace OnlineExam.Domain.Models
{
    public class Exam
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; }
        
        public string Description { get; set; }
        
        [Required]
        public int Duration { get; set; } // en minutos
        
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        
        public DateTime? AvailableFrom { get; set; }
        
        public DateTime? AvailableTo { get; set; }
        
        [Required]
        public string CreatedBy { get; set; } // UserId del profesor
        
        // Relaciones
        public ICollection<Question> Questions { get; set; }
        public ICollection<ExamAssignment> Assignments { get; set; }
    }
}