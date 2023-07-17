using Pace.Models;
using Pace.Usecases;
using System.Data;

namespace Pace.interfaces
{
    public interface IScoreService
    {

        public Task<bool> postScore(ScoreRequest score);

        public Task<List<EventResponse>> GetTopScores();
    } 
}
