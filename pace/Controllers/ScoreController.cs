using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Pace.interfaces;
using Pace.Models;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Pace.Controllers
{
    //[Route("api/[controller]")]
    [Route("score")]
    [ApiController]
    public class ScoreController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public ScoreController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost(Name = nameof(SubmitScore))]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(typeof(SubmitTFSAResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> SubmitScore([FromBody] ScoreRequest application, [FromServices] IScoreService useCase)
        {
            if ((await useCase.postScore(application)) == true)
            {
                return Ok();
            }

            throw new Exception("Failed to post score");
        }

        [HttpGet]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(List<EventResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetScore([FromServices] IScoreService useCase)
        {
            var scores = await useCase.GetTopScores();
            return Ok(scores);
        }
    }
}