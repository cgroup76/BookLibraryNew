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
        [HttpGet(" getPostPerClub")]
        public List<dynamic> getPostPerClub(int clubId)
        {
            return BookClub.getPostPerClub(clubId);
        }


       
        [HttpGet("getAllClubs")]
        public List<dynamic> Get()
        {
            return BookClub.getAllClubs();
        }


        // POST api/<BookClubController>
        [HttpPost("creatClub")]
        public IActionResult CreateClub([FromQuery] string clubName, [FromQuery] int userId)
        {
           int status= BookClub.createNewClub( clubName, userId);
            if (status == 1) { return Ok(true); }

            else if (status == 0) { return NotFound(false); }

            return Unauthorized("user session has ended");
        }  
       
        [HttpPost("addNewPost")]
        public IActionResult addNewPost(int clubId, int userId, string description, string image)
        {
           int status= BookClub.addNewPost(clubId,userId, description, image);
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
        [HttpPut("addLikeToPost")]
        public IActionResult Put(int postId,int userId)
        {
            int status = BookClub.addLikeToPost(postId, userId);
            if (status == 1) { return Ok(true); }

            else if (status == 0) { return NotFound(false); }

            return Unauthorized("user session has ended");
        }

        // DELETE api/<BookClubController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
