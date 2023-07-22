using Pace.Models;

namespace Pace.interfaces
{
    public interface IWordService
    {

        public Task<string[]> GetWords();

        public Task CreateWordEvent();

        public Task UpdatePreviousEvents();

        public Task<ActiveEventResponse> GetActiveEvent();
    }
}
