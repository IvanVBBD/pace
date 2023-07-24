using Pace.interfaces;
using Pace.Models;
using System.Data.SqlClient;
using System.Data;

namespace Pace.Usecases
{
    public class ScoreService : IScoreService
    {
        private readonly IDatabaseService _databaseService;
        private readonly IWordService _wordService;

        public ScoreService(IDatabaseService databaseService,IWordService wordService)
        {
            _databaseService = databaseService;
            _wordService = wordService;
        }

        public async Task<bool> postScore(ScoreRequest score)
        {
            try
            {
                var id = await GetUserIdByName(score.username);
                var activeEvent = await _wordService.GetActiveEvent();
                var eventID = activeEvent.EventId;
                var duration = score?.time ?? 999999999;
                await InsertScoreEventResponse(eventID, id, duration);
                return true;
            }catch(Exception ex)
            {
                throw;
            }
        }

        public async Task InsertScoreEventResponse(int eventId, int userId, int duration)
        {
            string query = "INSERT INTO EVENTRESPONSES (event_id, user_id, duration) VALUES (@EventId, @UserId, @Duration)";
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@EventId", eventId),
                new SqlParameter("@UserId", userId),
                new SqlParameter("@Duration", duration)
            };

            await _databaseService.ExecuteQuery(query, parameters);
        }

        public async Task<int> GetUserIdByName(string username)
        {
            string query = "SELECT user_id FROM USERS WHERE user_name = @Username";
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Username", username)
            };

            DataTable result = await _databaseService.ExecuteQuery(query, parameters);

            if (result.Rows.Count > 0)
            {
                int userId = Convert.ToInt32(result.Rows[0]["user_id"]);
                return userId;
            }

            throw new Exception("User not found");
        }

        public async Task<List<EventResponse>> GetTopScores()
        {
            string query = "SELECT TOP 10 E.event_id, U.user_name, E.duration " +
                    "FROM EVENTRESPONSES AS E " +
                    "INNER JOIN USERS AS U ON E.user_id = U.user_id " +
                    "ORDER BY E.duration ASC";

            DataTable result = await _databaseService.ExecuteQuery(query, null);

            List<EventResponse> top10Scores = new List<EventResponse>();

            foreach (DataRow row in result.Rows)
            {   
                try
                {
                    int eventId = Convert.ToInt32(row["event_id"]);
                    string userEmail = row["user_name"].ToString();
                    int duration = int.Parse(row["duration"].ToString());
                    EventResponse eventResponse = new EventResponse
                    {
                        username = userEmail,
                        Duration = duration
                    };

                    top10Scores.Add(eventResponse);
                }
                catch(Exception ex)
                {
                    Console.WriteLine(ex.Message);
                    continue;
                }
                

               
            }

            return top10Scores;
        }


    }
}
