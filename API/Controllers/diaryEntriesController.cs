using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using DagbokOlikaFrontendRamverk.API.Models;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class diaryEntriesController : ControllerBase
    {
        //Create list of DiaryEntries
        private static List<DiaryEntry> _entries = new List<DiaryEntry>();
        private readonly ILogger<diaryEntriesController>_logger;

        // Inject ILogger
        public diaryEntriesController(ILogger<diaryEntriesController> logger)
        {
            _logger = logger;
        }
        //Get all entries
        [HttpGet]
        public ActionResult<IEnumerable<DiaryEntry>> GetEntries()
        {
            
            _logger.LogInformation("---------INLÄGG---------");
            return Ok(_entries);
        }

        //Get specific entry
        [HttpGet("{id}")]
        public ActionResult<DiaryEntry> GetEntry(int id)
        {
            var entry = _entries.FirstOrDefault(e => e.Id == id);
            if (entry == null)
                return NotFound();
            return Ok(entry);
        }
        //Post new entry
        [HttpPost]
        public ActionResult<DiaryEntry> CreateEntry([FromBody] DiaryEntry newEntry)
        {
           _logger.LogInformation("POST request to create a new diary entry.");
            newEntry.Id = _entries.Count + 1;
            newEntry.DateCreated = DateTime.Now;
            _entries.Add(newEntry);
            _logger.LogInformation($"Entry with id {newEntry.Id} created.");
            return CreatedAtAction(nameof(GetEntry), new { id = newEntry.Id }, newEntry);
        }
        // PUT request to update an existing diary entry
        [HttpPut("{id}")]
        public IActionResult UpdateEntry(int id, [FromBody] DiaryEntry updatedEntry)
        {
            _logger.LogInformation($"PUT request to update diary entry with id {id}.");

            var entry = _entries.FirstOrDefault(e => e.Id == id);
            if (entry == null)
                return NotFound(); // Return 404 if entry not found

            // Update the entry with new data
            entry.Title = updatedEntry.Title ?? entry.Title; // Use the new value if provided, otherwise keep the old one
            entry.Content = updatedEntry.Content ?? entry.Content;
        

            _logger.LogInformation($"Diary entry with id {id} updated.");
            return NoContent(); // Return 204 No Content status to indicate successful update
        }

        // DELETE request to delete a diary entry
        [HttpDelete("{id}")]
        public IActionResult DeleteEntry(int id)
        {
            _logger.LogInformation($"DELETE request to delete diary entry with id {id}.");

            var entry = _entries.FirstOrDefault(e => e.Id == id);
            if (entry == null)
                return NotFound(); // Return 404 if entry not found

            _entries.Remove(entry); // Remove the entry from the list

            _logger.LogInformation($"Diary entry with id {id} deleted.");
            return NoContent(); // Return 204 No Content status to indicate successful deletion
        }
    }
}
