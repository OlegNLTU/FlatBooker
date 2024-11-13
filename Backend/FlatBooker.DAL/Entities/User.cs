using Microsoft.AspNetCore.Identity;

namespace FlatBooker.DAL.Entities
{
    public class User : IdentityUser
    {
        ICollection<Flat> Flats { get; set; } = [];
        ICollection<BookedDate> BookedDates { get; set; } = [];
    }
}
