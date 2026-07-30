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
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }


        
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name)) {
                return BadRequest("Name is required. ");
            }

            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("Email is required. ");
            }

            if (string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Password is required. ");
            }

            var emailExists = await _context.Users.AnyAsync(u=>u.Email == request.Email);
            if (emailExists) {
                return BadRequest("Email already registered.");
            }

            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,
                Role = "Customer",
                CreatedAt = DateTime.UtcNow
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return Ok("User registered successfully");
        }

        
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("Email is required. ");
            }
            if (string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest("Password is required. ");
            }
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }
            var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
            if (!isPasswordValid)
            {
                return Unauthorized("Invalid email or password.");
            }
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Name),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: credentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

            return Ok(new AuthResponse
            {
                Token = tokenString,
            });
        }
    }
}
