using Microsoft.AspNetCore.Mvc;
using serverSide.BL;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace serverSide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthorsController : ControllerBase
    {
        // GET: ShowAllAuthors
        [HttpGet]
        public IEnumerable<Author> Get()
        {
            return Author.showAllAuthors();
        }
        // GET: find book By author Name
        [HttpGet("findBookByAuthor/{authorName}")]
        public IActionResult Get(string authorName)
        {
            List<Book> books = Author.findBookByAuthorName(authorName);
            if (books == null || books.Count == 0)
            {
                return NotFound("No books found for the given author.");
            }
            return Ok(books);
        }
        // GET 
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        // GET api/AuthorsController>/5
        [HttpGet("{name}")]
        //public string Get(string name)
        //{
        //    return "value";
        //}
        // POST api/<AuthorsController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<AuthorsController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }


        // DELETE api/<AuthorsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
