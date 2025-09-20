using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExamAPI.Data;
using OnlineExamAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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
        public async Task<ActionResult<IEnumerable<Exam>>> GetExams()
        {
            return await _context.Exams.Include(e => e.Questions).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Exam>> CreateExam(Exam exam)
        {
            exam.CreatedDate = DateTime.UtcNow;
            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, exam);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Exam>> GetExam(int id)
        {
            var exam = await _context.Exams.Include(e => e.Questions)
                                         .FirstOrDefaultAsync(e => e.Id == id);

            if (exam == null)
            {
                return NotFound();
            }

            return exam;
        }
    }
}