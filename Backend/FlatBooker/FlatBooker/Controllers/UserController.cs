using FlatBooker.BLL.Services.Interfaces;
using FlatBooker.DAL.Entities;
using FlatBooker.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlatBooker.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IFlatService _flatService;
        public UserController(UserManager<User> userManager, IFlatService flatService)
        {
            _userManager = userManager;
            _flatService = flatService;
        }

        [HttpPost("/change-password")]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] ChangePasswordModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Username);
            if (user == null)
                return BadRequest("User not found");

            var isOldPasswordCorrect = await _userManager.CheckPasswordAsync(user, model.OldPassword);
            if (!isOldPasswordCorrect)
                return BadRequest("Old password is incorrect");

            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (!result.Succeeded)
                return BadRequest("Failed to change password");

            return Ok("Password changed successfully");
        }

        [HttpDelete("/delete-user/{userId}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound("User not found");

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description);
                return BadRequest(new { errors });
            }

            return Ok("User deleted successfully");
        }

        //TODO: delete any flat - admin
        // add flat, delete only your flat, update flat, book flat - any user can do that
    }
}
