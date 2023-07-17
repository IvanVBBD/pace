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
                var id = await GetUserIdByEmail(score.username);
                var eventID = (await _wordService.GetActiveEvent()).EventId;
                TimeSpan duration = TimeSpan.FromMinutes(30);
                await InsertScoreEventResponse(eventID, id, duration);
                return true;
            }catch(Exception ex)
            {
                throw;
            }
        }

        public async Task InsertScoreEventResponse(int eventId, int userId, TimeSpan duration)
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

        public async Task<int> GetUserIdByEmail(string userEmail)
        {
            string query = "SELECT user_id FROM USERS WHERE user_email = @Email";
            SqlParameter[] parameters = new SqlParameter[]
            {
                new SqlParameter("@Email", userEmail)
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
            string query = "SELECT TOP 10 E.event_id, U.user_email, E.duration " +
                    "FROM EVENTRESPONSES AS E " +
                    "INNER JOIN USERS AS U ON E.user_id = U.user_id " +
                    "ORDER BY E.duration ASC";

            DataTable result = await _databaseService.ExecuteQuery(query, null);

            List<EventResponse> top10Scores = new List<EventResponse>();

            foreach (DataRow row in result.Rows)
            {
                int eventId = Convert.ToInt32(row["event_id"]);
                string userEmail = row["user_email"].ToString();
                TimeSpan duration = TimeSpan.Parse(row["duration"].ToString());

                EventResponse eventResponse = new EventResponse
                {
                    UserEmail = userEmail,
                    Duration = duration
                };

                top10Scores.Add(eventResponse);
            }

            return top10Scores;
        }


    }
}
