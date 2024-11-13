using FlatBooker.BLL.Models;
using FlatBooker.BLL.Services;
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


        [HttpDelete("/delete-flat/{flatId}")]
        [Authorize(Policy = "RequireAdminRole")]
        public async Task<IActionResult> DeleteFlatAsync(string flatId)
        {
            var flat = await _flatService.GetFlatByIdAsync(flatId);
            if (flat == null)
                return NotFound("Flat not found");

            var result = await _flatService.DeleteFlatAsync(flatId);
            if (!result)
                return BadRequest("Failed to delete flat");

            return Ok("Flat deleted successfully");
        }

        [HttpPost("/add-flat")]
        public async Task<IActionResult> AddFlatAsync([FromBody] FlatModel flatModel)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized("User not authenticated");

            var result = await _flatService.AddFlatAsync(flatModel, user.Id);
            if (!result)
                return BadRequest("Failed to add flat");

            return Ok("Flat added successfully");
        }

        [HttpPost("/add-my-flat")]
        public async Task<IActionResult> AddMyFlatAsync([FromBody] FlatModel flatModel)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized("User not authenticated");

            var result = await _flatService.AddFlatAsync(flatModel, user.Id);
            if (!result)
                return BadRequest("Failed to add flat");

            return Ok("Flat added successfully");
        }

        [HttpDelete("/delete-my-flat/{flatId}")]
        public async Task<IActionResult> DeleteMyFlatAsync(string flatId)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized("User not authenticated");

            var flat = await _flatService.GetFlatByIdAsync(flatId);
            if (flat == null || flat.OwnerId != user.Id)
                return BadRequest("You cannot delete this flat");

            var result = await _flatService.DeleteFlatAsync(flatId);
            if (!result)
                return BadRequest("Failed to delete flat");

            return Ok("Your flat has been deleted successfully");
        }

        [HttpPut("/update-my-flat/{flatId}")]
        public async Task<IActionResult> UpdateMyFlatAsync(string flatId, [FromBody] FlatModel flatModel)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized("User not authenticated");

            var flat = await _flatService.GetFlatByIdAsync(flatId);
            if (flat == null || flat.OwnerId != user.Id)
                return BadRequest("You cannot update this flat");

            var result = await _flatService.UpdateFlatAsync(flatId, flatModel);
            if (!result)
                return BadRequest("Failed to update flat");

            return Ok("Flat updated successfully");
        }

        [HttpPost("/book-flat/{flatId}")]
        public async Task<IActionResult> BookFlatAsync(string flatId, [FromBody] BookingModel model)
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
                return Unauthorized("User not authenticated");

            var flat = await _flatService.GetFlatByIdAsync(flatId);
            if (flat == null)
                return NotFound("Flat not found");

            var result = await _flatService.BookFlatAsync(flatId, user.Id, model);
            if (!result)
                return BadRequest("Failed to book flat");

            return Ok("Flat booked successfully");
        }
    }
}
