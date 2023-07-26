using System.ComponentModel.DataAnnotations;

namespace Pace.Models
{
    public class ScoreRequest
    {
        [Required()]
        public string? username { get; set; }

        [Required()]
        public int? time { get; set; }
    }
}
