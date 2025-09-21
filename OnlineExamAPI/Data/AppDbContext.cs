using Microsoft.EntityFrameworkCore;
using OnlineExamAPI.Models;

namespace OnlineExamAPI.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Exam> Exams { get; set; }
        public DbSet<Question> Questions { get; set; }
        public DbSet<ExamSubmission> ExamSubmissions { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configurar Exam -> Questions relación uno a muchos
            modelBuilder.Entity<Exam>()
                .HasMany(e => e.Questions)
                .WithOne()
                .HasForeignKey(q => q.ExamId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}