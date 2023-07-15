using Pace.interfaces;
using Pace.Models;

namespace Pace.Usecases
{
    public class ScoreService : IScoreService
    {
        private readonly IDatabaseService _databaseService;

        public ScoreService(IDatabaseService databaseService)
        {
            _databaseService = databaseService;
        }

        public async Task<bool> postScore(ScoreRequest score)
        {


        }


    }
}
