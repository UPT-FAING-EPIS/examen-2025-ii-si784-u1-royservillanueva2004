using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExamAPI.Data;
using OnlineExamAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Text.Json;
using System.Linq;

namespace OnlineExamAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExamsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExamsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetExams()
        {
            var exams = await _context.Exams.Include(e => e.Questions).ToListAsync();
            
            // Crear respuesta con options deserializadas
            var response = exams.Select(exam => new
            {
                exam.Id,
                exam.Title,
                exam.Description,
                exam.Duration,
                exam.CreatedDate,
                exam.CreatedBy,
                Questions = exam.Questions.Select(q => new
                {
                    q.Id,
                    q.Text,
                    q.Type,
                    q.Points,
                    q.ExamId,
                    q.CorrectAnswer,
                    Options = !string.IsNullOrEmpty(q.OptionsJson) 
                        ? JsonSerializer.Deserialize<List<string>>(q.OptionsJson) 
                        : new List<string>()
                }).ToList()
            });

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<object>> CreateExam([FromBody] ExamRequest examRequest)
        {
            try
            {
                Console.WriteLine($"📝 Recibiendo examen: {examRequest?.Title}");
                Console.WriteLine($"📋 Número de preguntas: {examRequest?.Questions?.Count ?? 0}");

                // Validación básica
                if (examRequest == null)
                {
                    return BadRequest("El examen no puede ser nulo");
                }

                if (string.IsNullOrEmpty(examRequest.Title))
                {
                    return BadRequest("El título del examen es requerido");
                }

                // Crear el examen desde el request
                var exam = new Exam
                {
                    Title = examRequest.Title,
                    Description = examRequest.Description,
                    Duration = examRequest.Duration,
                    CreatedBy = examRequest.CreatedBy,
                    CreatedDate = DateTime.UtcNow,
                    Questions = examRequest.Questions?.Select(q => new Question
                    {
                        Text = q.Text,
                        Type = q.Type,
                        Points = q.Points,
                        CorrectAnswer = q.CorrectAnswer,
                        OptionsJson = q.Options != null ? JsonSerializer.Serialize(q.Options) : "[]"
                    }).ToList() ?? new List<Question>()
                };

                _context.Exams.Add(exam);
                var result = await _context.SaveChangesAsync();
                
                Console.WriteLine($"💾 SaveChangesAsync result: {result} cambios guardados");
                Console.WriteLine($"🆔 Nuevo examen ID: {exam.Id}");
                
                // Devolver respuesta con options deserializadas
                var response = new
                {
                    exam.Id,
                    exam.Title,
                    exam.Description,
                    exam.Duration,
                    exam.CreatedDate,
                    exam.CreatedBy,
                    Questions = exam.Questions.Select(q => new
                    {
                        q.Id,
                        q.Text,
                        q.Type,
                        q.Points,
                        q.ExamId,
                        q.CorrectAnswer,
                        Options = !string.IsNullOrEmpty(q.OptionsJson) 
                            ? JsonSerializer.Deserialize<List<string>>(q.OptionsJson) 
                            : new List<string>()
                    }).ToList()
                };

                return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"❌ Error al guardar examen: {ex.Message}");
                Console.WriteLine($"📖 StackTrace: {ex.StackTrace}");
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<object>> GetExam(int id)
        {
            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound();
            }

            // Crear respuesta con options deserializadas
            var response = new
            {
                exam.Id,
                exam.Title,
                exam.Description,
                exam.Duration,
                exam.CreatedDate,
                exam.CreatedBy,
                Questions = exam.Questions.Select(q => new
                {
                    q.Id,
                    q.Text,
                    q.Type,
                    q.Points,
                    q.ExamId,
                    q.CorrectAnswer,
                    Options = !string.IsNullOrEmpty(q.OptionsJson) 
                        ? JsonSerializer.Deserialize<List<string>>(q.OptionsJson) 
                        : new List<string>()
                }).ToList()
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(int id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }

    
    public class ExamRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Duration { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public List<QuestionRequest> Questions { get; set; } = new List<QuestionRequest>();
    }

    public class QuestionRequest
    {
        public string Text { get; set; } = string.Empty;
        public string Type { get; set; } = "multiple";
        public int Points { get; set; }
        public string CorrectAnswer { get; set; } = string.Empty;
        public List<string> Options { get; set; } = new List<string>();
    }
}