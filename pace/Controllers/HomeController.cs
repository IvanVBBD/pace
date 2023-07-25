using Microsoft.AspNetCore.Mvc;
using Pace.Models;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;

namespace Pace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public HomeController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        [HttpGet("user-details")]
        public async Task<IActionResult> GetUserDetails(string accessToken)
        {
            // Construct the API request URL
            var apiUrl = "https://api.github.com/user";

            // Create an HttpClient instance using the IHttpClientFactory
            var httpClient = _httpClientFactory.CreateClient();

            // Set the GitHub API base URL and add the access token to the Authorization header
            httpClient.BaseAddress = new Uri("https://api.github.com/");
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            // Make the API request to get user details
            var response = await httpClient.GetAsync(apiUrl);

            // Check if the request was successful
            if (response.IsSuccessStatusCode)
            {
                // Read the response content as a string
                var responseContent = await response.Content.ReadAsStringAsync();

                // Deserialize the JSON response into a model representing user details
                var userDetails = JsonSerializer.Deserialize<UserDetailsModel>(responseContent);

                // Return the user details as JSON
                return Ok(userDetails);
            }

            // If the request was not successful, return an error response
            return StatusCode((int)response.StatusCode);
        }
    }
}