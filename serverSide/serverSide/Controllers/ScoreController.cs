using Microsoft.AspNetCore.Mvc;
using serverSide.BL;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace serverSide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScoreController : ControllerBase
    {
        // GET: api/<ScoreController>
        [HttpGet]
        public List<Score> Get(string gameName)
        {
            return Score.GetTop5Score(gameName);
        }

        // GET api/<ScoreController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ScoreController>
        [HttpPost]
        public bool Post([FromBody]Score newScore)
        {
            return Score.insertNewScore(newScore);
        }

        // PUT api/<ScoreController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ScoreController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
