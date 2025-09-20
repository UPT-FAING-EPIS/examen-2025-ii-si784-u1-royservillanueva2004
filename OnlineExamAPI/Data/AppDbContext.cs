using Microsoft.EntityFrameworkCore;
using OnlineExamAPI.Models;
using System.Text.Json;

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

            // Configurar ExamSubmission
            modelBuilder.Entity<ExamSubmission>()
                .HasKey(es => es.Id);

            // Configurar que Answers se almacene como JSON (manejo seguro de nulls)
            modelBuilder.Entity<ExamSubmission>()
                .Property(es => es.Answers)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<Dictionary<int, string>>(v, (JsonSerializerOptions?)null) ?? new Dictionary<int, string>()
                );

            // Configurar que Options se almacene como JSON (manejo seguro de nulls)
            modelBuilder.Entity<Question>()
                .Property(q => q.Options)
                .HasConversion(
                    v => JsonSerializer.Serialize(v, (JsonSerializerOptions?)null),
                    v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions?)null) ?? new List<string>()
                );
        }
    }
}