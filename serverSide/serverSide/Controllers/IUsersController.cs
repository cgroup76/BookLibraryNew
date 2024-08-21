using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using serverSide.BL;
using System.Dynamic;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace serverSide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IUsersController : ControllerBase
    {


        // GET: api/<IUsersController>
        [HttpGet]
        public List<dynamic> Get(int userId)
        {
            return IUser.showMyBooks(userId);

        }
        // GET: api/<IUsersController>
        [HttpGet("getRecommendedBook")]
        public List<dynamic> GetRecommendedBooks(int userId)
        {
            return IUser.getRecommendedBooksForUser(userId);

        }
        [HttpGet("GetRequestsPerUser")]
        public IActionResult GetRequestsPerUser(int userId)
        {
            List<dynamic> lst = IUser.getRequestsPerUser(userId);

            if(lst.Count == 1 && lst[0].statusN == -1) { return Unauthorized("user session has ended"); }

            else { return Ok(lst); }
        } 
        [HttpGet("getMyRequestToBuyPerUser")]
        public IActionResult getMyRequestToBuyPerUser(int userId)
        {
            List<dynamic> lst = IUser.getMyRequestToBuyPerUser(userId);

            if (lst.Count == 1 && lst[0].statusN == -1) { return Unauthorized("user session has ended"); }

            else { return Ok(lst); }
        }

        [HttpGet("GetAllIusers")]
        public List<dynamic> GetAllIusers()
        {
            return IUser.GetAllIusers();
        }

        // POST sign up new user
        [HttpPost("signUpNewUser")]
        public IActionResult Post([FromBody] IUser newUser)
        {
            int newUserId = newUser.Insert(newUser);

            if (newUserId != 0)
            {
                if (newUserId==-1) { return Ok(newUserId); }
                else
                {
                    dynamic userDetails = new ExpandoObject();

                    userDetails.userId = newUserId;
                    userDetails.userName = newUser.UserName;

                    return Ok(userDetails);
                }
            }
            return BadRequest();
        }
        // POST api/<IUsersController>
        [HttpPost("addNewBookToUser")]
        public IActionResult Post(int userId, int bookId)
        {
            int status = IUser.addNewBook(userId, bookId);

            if (status == 1) { return Ok(true); }

            else if (status == 0) { return NotFound(false); }

            return Unauthorized("user session has ended");
        }

        // POST insert new request
        [HttpPost("insertNewRequest")]
        public IActionResult POST(int sellerId, int buyerId, int bookId)
        {
            int status = IUser.insertNewRequest(sellerId, buyerId, bookId);

            if (status == 1) { return Ok(true); }

            else if (status == 0) { return NotFound(false); }

            return Unauthorized("user session has ended");
        }

        // PUT logout user by id
        [HttpPut("logoutUser")]
        public bool Put([FromBody] int userId)
        {
            return IUser.Logout(userId);
        }

        // PUT login user
        [HttpPut("loginUser")]
        public IActionResult Put([FromBody] IUser user)
        {
            object loggedinUserDetails = IUser.Login(user);

            if (((IDictionary<string, object>)loggedinUserDetails).Any()) { return Ok(loggedinUserDetails); } // checks if the object is not empty

            else { return NotFound(); }
        }
        // PUT book as read by user 
        [HttpPut("readBookByUser")]
        public IActionResult Put(int bookId, int userId)
        {
            int status = IUser.readBook(bookId, userId);

            if (status == 1) { return Ok(true); }

            else if (status == 0) { return NotFound(false); }

            return Unauthorized("user session has ended");
        }
        
     

        // PUT sale and buy books
        [HttpPut("requestHandling")]
        public IActionResult Put( int sellerId, int buyerId, int bookId, string requeststatus)
        {
            int status = IUser.requestHandling(sellerId, buyerId, bookId, requeststatus);

            if (status == 1) { return Ok(true); }

            else if (status == 0) { return NotFound(false); }

            return Unauthorized("user session has ended");
           
        }

        // PUT login google user
        [HttpPut("loginGoogleUser")]
        public IActionResult LogInWithGoogle([FromBody] IUser user)
        {
            object loggedinUserDetails = IUser.LogInWithGoogle(user);

            if (loggedinUserDetails != null) { return Ok(loggedinUserDetails); } // checks if the object is not empty

            else { return NotFound(); }
        }

        // DELETE api/<IUsersController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)

        {
        }

    }
}
