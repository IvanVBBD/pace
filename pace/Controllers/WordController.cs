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
        //[Authorize]
        [Route("challenge")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(WordResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> word([FromServices] IWordService useCase)
        {
            string authorizationHeader = HttpContext.Request.Headers["Authorization"];
            if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer "))
            {
                string token = authorizationHeader.Substring("Bearer ".Length).Trim();
                try
                {
                    ClaimsPrincipal principal = JwtTokenValidator.ValidateToken(token, _configuration);
                    string userId = principal.FindFirstValue("Id");
                    if (!string.IsNullOrEmpty(userId))
                    {
                        var activeEvent = await useCase.GetActiveEvent();
                        var result = new WordResponse()
                        {
                            words = activeEvent.Words
                        };
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest("Invalid User ID");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(new ProblemDetails() { Detail = ex.Message });
                }
            }
            else
            {
                return BadRequest("Invalid token");
            }
        }

        [HttpGet]
        [Authorize]
        [Route("pratice")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(WordResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> pratice([FromServices] IWordService useCase)
        {
            string authorizationHeader = HttpContext.Request.Headers["Authorization"];
            if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer "))
            {
                string token = authorizationHeader.Substring("Bearer ".Length).Trim();
                try
                {
                    ClaimsPrincipal principal = JwtTokenValidator.ValidateToken(token, _configuration);
                    string userId = principal.FindFirstValue("Id");
                    if (!string.IsNullOrEmpty(userId))
                    {
                        var words = await useCase.GetWords();
                        var result = new WordResponse()
                        {
                            words = words
                        };
                        return Ok(result);
                    }
                    else
                    {
                        return BadRequest("Invalid User ID");
                    }
                }
                catch (Exception ex)
                {
                    return BadRequest(new ProblemDetails() { Detail = ex.Message });
                }
            }
            else
            {
                return BadRequest("Invalid token");
            }
        }
    }
}