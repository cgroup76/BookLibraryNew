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
        [HttpGet("findBookByAuthor")]
        public IActionResult Get(int authorId)
        {
            List<Object> books = Author.findBookByAuthorName(authorId);
            if (books == null || books.Count == 0)
            {
                return NotFound("No books found for the given author.");
            }
            return Ok(books);
        }
        // GET Libaries Per Author
        [HttpGet("GetLibrariesPerAuthor")]
        public List<dynamic> GetLibrariesPerAuthor()
        {
            return Author.getLibrariesPerAuthor();
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
