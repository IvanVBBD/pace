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
            string authorizationHeader = HttpContext.Request.Headers["Authorization"];
            if (!string.IsNullOrEmpty(authorizationHeader) && authorizationHeader.StartsWith("Bearer "))
            {
                string token = authorizationHeader.Substring("Bearer ".Length).Trim();
                try
                {
                    // var applicationReq = mapper.Map<CoreModels::ApplicationRequest>(application);
                    // var planNumber = await useCase.SubmitClientApplicationAsync(applicationReq, isUserAuthenticated, traceId, context.User, ct);
                    ClaimsPrincipal principal = JwtTokenValidator.ValidateToken(token, _configuration);
                    string userId = principal.FindFirstValue("Id");
                    if (!string.IsNullOrEmpty(userId))
                    {
                        if ((await useCase.postScore(application)) == true)
                        {
                            return Ok();
                        }

                        throw new Exception("Failed to post score");
                    }
                    else
                    {
                        return BadRequest("Invalid user ID");
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(List<EventResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult> GetScore([FromServices] IScoreService useCase)
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
                        var scores = await useCase.GetTopScores();
                        // string token = GetToken();
                        return Ok(scores);
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

        //testing jwt
        private string GetToken()
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("n3WSkrbsLTHXbog3JdW0Co0y/yA1/nsXWk6cF+GYGb4="));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(_configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                expires: DateTime.Now.AddMinutes(100),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private string GenerateSymmetricKey(int keySizeInBits)
        {
            byte[] keyBytes = new byte[keySizeInBits / 8];
            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(keyBytes);
            }

            string base64Key = Convert.ToBase64String(keyBytes);
            return base64Key;
        }
    }
}