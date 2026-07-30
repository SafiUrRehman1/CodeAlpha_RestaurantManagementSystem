using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using RestaurantManagementSystem.Data;
using RestaurantManagementSystem.DTOs;
using RestaurantManagementSystem.Models;
using Microsoft.AspNetCore.Authorization;

namespace RestaurantManagementSystem.Controllers
{
    [ApiController]
    [Route("api/[Controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }


        [Authorize(Roles = "Admin")]
        [HttpGet]

        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users.OrderByDescending(u => u.CreatedAt).Select(u => new UserResponse
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role,
                CreatedAt = u.CreatedAt,

            }).ToListAsync();

            return Ok(users);

        }

        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]

        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound($"User with id {id} not found.");
            }

            return Ok(new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
            
        public async Task<IActionResult> UpdateUserById(int id, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound($"User with id {id} not found");
            }

            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("Email is required. ");
            }


            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("Name is required. ");
            }

            var emailExists = await _context.Users.AnyAsync(u =>
                u.Id != id &&
                u.Email == request.Email);
            
            if (emailExists)
            {
                return BadRequest("Email already exists.");
            }


            var validRoles = new[]
            {
                "Admin",
                "Customer"
            };

            if (!validRoles.Contains(request.Role))
            {
                return BadRequest("Invalid role. ");
            }

            user.Name = request.Name;
            user.Email = request.Email;
            user.Role = request.Role;

            await _context.SaveChangesAsync();
            return Ok(new UserResponse
            {
                Id = user.Id,
                Email = user.Email,
                Name = user.Name,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
            
        public async Task<IActionResult> DeleteUserById(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound($"User with id {id} not found");
            }


            if (user.Id == currentUserId)
            {
                return BadRequest("You cannot delete your own account.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "User deleted successfully"
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            return Ok(new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateMyProfile(UpdateProfileRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                return BadRequest("Name is required.");
            }

            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("Email is required.");
            }

            var emailExists = await _context.Users.AnyAsync(u =>
                u.Id != userId &&
                u.Email == request.Email);

            if (emailExists)
            {
                return BadRequest("Email already exists.");
            }

            user.Name = request.Name;
            user.Email = request.Email;

            await _context.SaveChangesAsync();

            return Ok(new UserResponse
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            });
        }

        [Authorize]
        [HttpPut("change-password")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (string.IsNullOrWhiteSpace(request.CurrentPassword))
            {
                return BadRequest("Current password is required.");
            }

            if (string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest("New password is required.");
            }

            if (request.NewPassword.Length < 6)
            {
                return BadRequest("Password must be at least 6 characters.");
            }

            if (request.NewPassword != request.ConfirmPassword)
            {
                return BadRequest("Passwords do not match.");
            }

            var validPassword = BCrypt.Net.BCrypt.Verify(
                request.CurrentPassword,
                user.PasswordHash);

            if (!validPassword)
            {
                return BadRequest("Current password is incorrect.");
            }

            if (BCrypt.Net.BCrypt.Verify(request.NewPassword, user.PasswordHash))
            {
                return BadRequest("New password must be different from the current password.");
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Password changed successfully."
            });
        }

    }
}
