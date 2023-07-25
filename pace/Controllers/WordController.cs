using Microsoft.AspNetCore.Mvc;
using Pace.interfaces;
using Pace.Models;
using System.Text.Json.Nodes;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace Pace.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class WordController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public WordController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        [Authorize]
        [Route("challenge")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(WordResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> word([FromServices] IWordService useCase)
        {
            var activeEvent = await useCase.GetActiveEvent();
            var result = new WordResponse()
            {
                words = activeEvent.Words
            };
            return Ok(result);
        }

        [HttpGet]
        [Authorize]
        [Route("practice")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(WordResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> pratice([FromServices] IWordService useCase)
        {
            var words = await useCase.GetWords();
            var result = new WordResponse()
            {
                words = words
            };
            return Ok(result);
        }
    }
}