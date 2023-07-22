using Microsoft.AspNetCore.Mvc;
using Pace.interfaces;
using Pace.Models;
using System.Diagnostics;

namespace Pace.Controllers
{
    //[Route("api/[controller]")]
    [Route("score")]
    [ApiController]
    public class ScoreController : ControllerBase
    {

        [HttpPost(Name = nameof(SubmitScore))]
        [ProducesResponseType(StatusCodes.Status200OK)]
        //[ProducesResponseType(typeof(SubmitTFSAResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> SubmitScore([FromBody] ScoreRequest application, [FromServices] IScoreService useCase)
        {
            try
            {
                // var applicationReq = mapper.Map<CoreModels::ApplicationRequest>(application);
                // var planNumber = await useCase.SubmitClientApplicationAsync(applicationReq, isUserAuthenticated, traceId, context.User, ct);
                if((await useCase.postScore(application)) == true)
                {
                    return Ok();
                }

                throw new Exception("Failed to post score");
                
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails() { Detail = ex.Message });
            }
        }
        
        
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(List<EventResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetScore([FromServices] IScoreService useCase)
        {
            try
            {
                var scores = await useCase.GetTopScores();
                return Ok(scores);                
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails() { Detail = ex.Message });
            }
        }

    }
}
