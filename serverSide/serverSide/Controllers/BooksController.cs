using Microsoft.AspNetCore.Mvc;
using serverSide.BL;
using System.Data.SqlClient;
using System.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace serverSide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        // GET - get all books
        [HttpGet]
        public IEnumerable<object> Get()
        {
            return Book.showBooks();
        }
        // GET - get top 5 books by rating 
        [HttpGet("showTop5BooksByRating")]
        public IEnumerable<object> GetTop5Courses()
        {
            return Book.showTop5BooksByrating();
        }

        // GET api/<BooksController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST add new book to DB
        [HttpPost("AddNewBook")]
        public bool Post([FromBody] Book newBook)
        {
            return newBook.AddNewBook(newBook);
        }

        // PUT api/<BooksController>/5
        [HttpPut("changeBookActivity")]
        public bool Put(int bookId)
        {
            return Book.changeBookActivity(bookId);
        }
        // PUT RateBook
        [HttpPut("RateBook")]
        public bool Put(int bookID, int newRating, int userID)
        {
            return Book.RateBook(bookID, newRating, userID);
        }

        // DELETE api/<BooksController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }


}
