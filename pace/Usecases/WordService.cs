using Microsoft.AspNetCore.Mvc;
using Pace.interfaces;
using Pace.Models;
using System.Data;
using System.Data.SqlClient;
using System.Text.Json;

namespace Pace.Usecases
{
    public class WordService :IWordService
    {
        private readonly HttpClient _httpClient;
        private readonly IDatabaseService _databaseService;

        public WordService(HttpClient httpClient, IDatabaseService databaseService)
        {
            _httpClient = httpClient;
            _databaseService = databaseService;
            CreateWordEvent();
        }

        public async Task CreateWordEvent()
        {
            try
            {
                await UpdatePreviousEvents();
                string[] words = await GetWords();
                string combinedWords = string.Join(" ", words);
                string query = "INSERT INTO EVENTS (words, active) VALUES (@Words, 1)";
                SqlParameter[] parameters = new SqlParameter[]
                {
                    new SqlParameter("@Words", combinedWords)
                };

                await _databaseService.ExecuteQuery(query, parameters);
                return;
            }catch(Exception ex)
            {
                throw (ex);
            }
           


        }

        public async Task UpdatePreviousEvents()
        {
            string updateQuery = "UPDATE EVENTS SET active = 0";
            await _databaseService.ExecuteQuery(updateQuery, null);
        }

        public async Task<string[]> GetWords()
        {
            try
            {
                string apiUrl = "https://random-word-api.vercel.app/api?words=10";

                HttpResponseMessage response = await _httpClient.GetAsync(apiUrl);

                if (response.IsSuccessStatusCode)
                {
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    string[] words = JsonSerializer.Deserialize<string[]>(jsonResponse);
                    return words;
                }
                throw new Exception("rsponse is not successful");

            }
            catch (Exception ex)
            {
                throw;
                
            }
        }

        public async Task<ActiveEventResponse> GetActiveEvent()
        {
            string query = "SELECT event_id, words FROM EVENTS WHERE active = 1";
            DataTable result = await _databaseService.ExecuteQuery(query, null);

            if (result.Rows.Count > 0)
            {
                int eventId = Convert.ToInt32(result.Rows[0]["event_id"]);
                string activeEvent = result.Rows[0]["words"].ToString();
                string[] wordsArray = activeEvent.Split(' ');

                return new ActiveEventResponse
                {
                    EventId = eventId,
                    Words = wordsArray
                };
            }

            throw new Exception("No active event found");
        }
    }

   
}
