using Microsoft.AspNetCore.Mvc;
using serverSide.BL;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace serverSide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookClubController : ControllerBase
    {
        // GET: api/<BookClubController>
        [HttpGet("getAllClubMembers")]
        public List<dynamic> Get( int clubId)
        {
            return BookClub.getAllMembersPerClub(clubId);
        }

   

        // POST api/<BookClubController>
        [HttpPost("creatClub")]
        public IActionResult Post(int bookId,string clubName, int userId)
        {
           int status= BookClub.createNewClub(bookId, clubName, userId);
            if (status == 1) { return Ok(true); }

            else if (status == 0) { return NotFound(false); }

            return Unauthorized("user session has ended");
        }

        [HttpPost("joinClub")]
        public IActionResult Post(int clubId,  int userId)
        {
            int status = BookClub.JoinClub(clubId, userId);
            if (status == 1) { return Ok(true); }

            else if (status == 0) { return NotFound(false); }

            return Unauthorized("user session has ended");
        }


        // PUT api/<BookClubController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<BookClubController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
