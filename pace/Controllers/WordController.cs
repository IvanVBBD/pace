using Microsoft.AspNetCore.Mvc;
using Pace.interfaces;
using Pace.Models;
using System.Text.Json.Nodes;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;

namespace Pace.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WordController : ControllerBase
    {
        [HttpGet]
        [Route("challenge")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(WordResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> word([FromServices] IWordService useCase)
        {
            try
            {
                var activeEvent = await useCase.GetActiveEvent();
                var result = new WordResponse()
                {
                    words = activeEvent.Words
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails() { Detail = ex.Message });
            }
        }

        [HttpGet]
        [Route("practice")]
        [Authorize]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(WordResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> pratice([FromServices] IWordService useCase)
        {
            try
            {
                var words = await useCase.GetWords();
                var result = new WordResponse()
                {
                    words = words
                };
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new ProblemDetails() { Detail = ex.Message });
            }
        }
    }
}