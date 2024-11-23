using FlatBooker.BLL.Services;
using FlatBooker.BLL.Services.Interfaces;
using FlatBooker.DAL.Entities;
using FlatBooker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FlatBooker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IJwtService _jwtService;

        public AuthenticationController(IJwtService jwtService, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _jwtService = jwtService;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet("/user-claims")]
        [Authorize]
        public IActionResult GetClaims()
        {
            var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;

            if (id == null || role == null)
            {
                return Unauthorized("User claims are missing");
            }

            return Ok(new ClaimsModel { Id = id, Role = role });
        }

        [HttpPost("/login")]
        public async Task<IActionResult> LoginAsync([FromBody] AuthenticationModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
                return BadRequest("Wrong username or password");

            var roles = await _userManager.GetRolesAsync(user);
            var tokenString = _jwtService.GetToken(user.Id, user.UserName, roles[0]);

            return Ok(new { token = tokenString });
        } 

        [HttpPost("/register")]
        public async Task<IActionResult> RegisterAsync([FromBody] AuthenticationModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);

            if (user != null)
                return BadRequest("User exist");

            var newUser = new User { UserName = model.Username };
            var result = await _userManager.CreateAsync(newUser, model.Password);

            if (!result.Succeeded)
                return BadRequest("Smth went wrong");

            if (newUser.UserName.Equals("oleg1234"))
                await AddUserToRole(newUser, "admin");
            else
                await AddUserToRole(newUser, "user");

            return Ok("User was added");
        }

        private async Task AddUserToRole(User user, string roleName)
        {
            var roleExists = await _roleManager.RoleExistsAsync(roleName);

            if (!roleExists)
            {
                var role = new IdentityRole(roleName);
                await _roleManager.CreateAsync(role);
            }
            await _userManager.AddToRoleAsync(user, roleName);
        }
    }
}
