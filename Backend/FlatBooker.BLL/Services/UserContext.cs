using FlatBooker.BLL.Services.Interfaces;
using System.Security.Claims;

namespace FlatBooker.BLL.Services
{
    public class UserContext : IUserContext
    {
        private readonly ClaimsPrincipal _user;
        public UserContext(ClaimsPrincipal user)
        {
            _user = user;
        }

        public string? GetUserId()
        {
            var userIdClaim = _user.FindFirst(ClaimTypes.NameIdentifier);
            return userIdClaim?.Value;
        }

        public string? GetUserRole()
        {
            var userRoleClaim = _user.FindFirst(ClaimTypes.Role);
            return userRoleClaim?.Value;
        }
    }
}
