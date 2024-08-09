using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using OpenIddict.Abstractions;
using QuickApp.Server.Core.Constants;
using QuickApp.Server.Core.Dtos.Auth;
using QuickApp.Server.Core.Dtos.General;
using QuickApp.Server.Core.Entities;
using QuickApp.Server.Core.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QuickApp.Server.Core.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogService _logService;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, ILogService logService, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _logService = logService;
            _configuration = configuration;
        }

        public async Task<GeneralServiceResponseDto> SeedRoleAsync()
        {
            bool isOwnerRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.OWNER);
            bool isAdminRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.ADMIN);
            bool isManagerRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.MANAGER);
            bool isUserRoleExists = await _roleManager.RoleExistsAsync(StaticUserRoles.USER);

            if (isOwnerRoleExists && isAdminRoleExists && isManagerRoleExists && isUserRoleExists)
                return new GeneralServiceResponseDto()
                {
                    IsSuccess = true,
                    StatusCode = 200,
                    Message = "Jaydip Seeding Role is Already Done"
                };

            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.OWNER));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.ADMIN));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.MANAGER));
            await _roleManager.CreateAsync(new IdentityRole(StaticUserRoles.USER));

            return new GeneralServiceResponseDto()
            {

                IsSuccess = true,
                StatusCode = 201,
                Message = "Seeding Role is done Successfully"
            };
        }

        public async Task<GeneralServiceResponseDto> RegisterAsync(RegisterDto registerDto)
        {
            var isExistsUser = await _userManager.FindByNameAsync(registerDto.UserName);
            if (isExistsUser is not null)
                return new GeneralServiceResponseDto()
                {
                    IsSuccess = false,
                    StatusCode = 409,
                    Message = "Jaydip UserName is Alredy Exists"
                };

            ApplicationUser newUser = new ApplicationUser();
            {
                newUser.FirstName = registerDto.FirstName;
                newUser.LastName = registerDto.LastName;
                newUser.Email = registerDto.Email;
                newUser.UserName = registerDto.UserName;
                newUser.SecurityStamp = Guid.NewGuid().ToString();
            };

            var createUserResult = await _userManager.CreateAsync(newUser, registerDto.Password);
            if (!createUserResult.Succeeded)
            {
                return new GeneralServiceResponseDto()
                {
                    IsSuccess = false,
                    StatusCode = 400,
                    Message = "Jaydip User Creation Failed Because:"
                };
            }

            // Add a Default User role to all Users
            await _userManager.AddToRoleAsync(newUser, StaticUserRoles.USER);
            await _logService.SaveNewLog(newUser.UserName, "Registered to Website");
            return new GeneralServiceResponseDto()
            {
                IsSuccess = true,
                StatusCode = 201,
                Message = " Jaydip User created Successfully"
            };
        }

        //public async Task<LoginServiceResponseDto?> LoginAsync(LoginDto loginDto)
        //{
        //    //Find user with username
        //    var user = await _userManager.FindByNameAsync(loginDto.UserName);
        //    if (user is null)
        //    {
        //        return null;
        //    }
        //    //blocked
        //    if (user.IsBlocked)
        //    {
        //        return null;
        //    }

        //    // check password of user
        //    var isPasswordCorrect = await _userManager.CheckPasswordAsync(user, loginDto.Password);
        //    if (!isPasswordCorrect)
        //    {
        //        return null;
        //    }


        //    // Return Token and userInfo to front-end
        //    var newToken = await GenerateJWTTokenAsync(user);
        //    var roles = await _userManager.GetRolesAsync(user);
        //    var userInfo = GenerateUserInfoObject(user, roles);
        //    await _logService.SaveNewLog(user.UserName, "New Login");

        //    return new LoginServiceResponseDto()
        //    {
        //        NewToken = newToken,
        //        UserInfo = userInfo
        //    };
        //}


        public async Task<GeneralServiceResponseDto> UpdateRoleAsync(ClaimsPrincipal User, UpdateRoleDto updateRoleDto)
        {
            var user = await _userManager.FindByNameAsync(updateRoleDto.UserName);
            if (user is null)
                return new GeneralServiceResponseDto()
                {
                    IsSuccess = false,
                    StatusCode = 404,
                    Message = "Invalid UserName"
                };
            var userRoles = await _userManager.GetRolesAsync(user);
            // Just The OWNER and ADMIN can update roles
            if (User.IsInRole(StaticUserRoles.ADMIN))
            {
                // User is Admin
                if (updateRoleDto.NewRole == RoleType.USER || updateRoleDto.NewRole == RoleType.MANAGER)
                {
                    // owners and admin  can change the role of everyone excepted
                    if (userRoles.Any(q => q.Equals(StaticUserRoles.OWNER) || q.Equals(StaticUserRoles.ADMIN)))
                    {
                        return new GeneralServiceResponseDto()
                        {
                            IsSuccess = false,
                            StatusCode = 403,
                            Message = "You are not allowed to change role of this user"
                        };
                    }
                    else
                    {
                        await _userManager.RemoveFromRolesAsync(user, userRoles);
                        await _userManager.AddToRoleAsync(user, updateRoleDto.NewRole.ToString());
                        await _logService.SaveNewLog(user.UserName, "User Roles Updated");
                        return new GeneralServiceResponseDto()
                        {
                            IsSuccess = true,
                            StatusCode = 200,
                            Message = "Role is updated successfully"
                        };
                    }
                }
                else return new GeneralServiceResponseDto()
                {
                    IsSuccess = false,
                    StatusCode = 403,
                    Message = " Jaydip you are not allowed to change role of this user"
                };
            }
            else
            {
                // user is owner
                if (userRoles.Any(q => q.Equals(StaticUserRoles.OWNER)))
                {
                    return new GeneralServiceResponseDto()
                    {
                        IsSuccess = false,
                        StatusCode = 403,
                        Message = "You are not allowed to change role of this user"
                    };
                }
                else
                {
                    await _userManager.RemoveFromRolesAsync(user, userRoles);
                    await _userManager.AddToRoleAsync(user, updateRoleDto.NewRole.ToString());
                    await _logService.SaveNewLog(user.UserName, "User Roles Updated");
                    return new GeneralServiceResponseDto()
                    {
                        IsSuccess = true,
                        StatusCode = 200,
                        Message = "Role  is updated successfully"
                    };
                }
            }
        }


        public async Task<UserInfoResult?> MeAsync(ClaimsPrincipal User)
        {

            //ClaimsPrincipal handler = new JwtSecurityTokenHandler().ValidateToken(meDto.Token, new TokenValidationParameters()
            //{
            //    ValidateIssuer = true,
            //    ValidateAudience = true,
            //    ValidIssuer = _configuration["JWT:Issuer"],
            //    ValidAudience = _configuration["JWT:Audience"],
            //    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]))
            //}, out SecurityToken securityToken);

            string decodedUserName = User.Claims.FirstOrDefault(x => x.Type == OpenIddictConstants.Claims.Name).Value;
            if (decodedUserName is null)
                return null;

            var user = await _userManager.FindByNameAsync(decodedUserName);
            if (user is null)
                return null;

            // Return Token and userInfo to front-end
            //var newToken = await GenerateJWTTokenAsync(user);
            var roles = await _userManager.GetRolesAsync(user);
            var userInfo = GenerateUserInfoObject(user, roles);
            //await _logService.SaveNewLog(user.UserName, "New Token Generated");

            return userInfo;
            //{
            //    NewToken = newToken,
            //    UserInfo = userInfo
            //};
        }


        public async Task<IEnumerable<UserInfoResult>> GetUsersListAsync()
        {
            var users = await _userManager.Users.ToListAsync();

            List<UserInfoResult> userInfoResults = new List<UserInfoResult>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userInfo = GenerateUserInfoObject(user, roles);
                userInfoResults.Add(userInfo);
            }
            return userInfoResults;
        }


        public async Task<UserInfoResult?> GetUserDetailsByUserNameAsync(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null)
                return null;

            var roles = await _userManager.GetRolesAsync(user);
            var userInfo = GenerateUserInfoObject(user, roles);
            return userInfo;
        }

        public async Task<string> DeleteByIdAsync(string Id)
        {
            var user = _userManager.Users.SingleOrDefault(x => x.Id == Id);

            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);

                if (result.Succeeded)
                {
                    return "User is Deleted Successfully";
                }
            }
            return "User Not Found";
        }

        public async Task<GeneralServiceResponseDto> BlockByIdAsync(string Id)
        {
            var user = await _userManager.FindByIdAsync(Id);

            if (user != null)
            {
                if (user.IsBlocked == true)
                {
                    user.IsBlocked = false;
                }
                else
                {
                    user.IsBlocked = true;
                }

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    if (user.IsBlocked == true)
                    {
                        return new GeneralServiceResponseDto()
                        {
                            IsSuccess = true,
                            StatusCode = 200,
                            Message = "User is Blocked"
                        };
                    }
                    else
                    {
                        return new GeneralServiceResponseDto()
                        {
                            IsSuccess = false,
                            StatusCode = 200,
                            Message = " User is UnBlocked"
                        };
                    }

                }
            }
            return new GeneralServiceResponseDto()
            {
                IsSuccess = false,
                StatusCode = 404,
                Message = "User is Not Found"
            };
        }


        //GenerateJWTTokenAsync
        private async Task<string> GenerateJWTTokenAsync(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            var authClaims = new List<Claim>()
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName)
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var authSecret = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));
            var signingCredentials = new SigningCredentials(authSecret, SecurityAlgorithms.HmacSha256);

            var tokenObject = new JwtSecurityToken(
              issuer: _configuration["JWT:Issuer"],
              audience: _configuration["JWT:Audience"],
              notBefore: DateTime.Now,
              expires: DateTime.Now.AddMinutes(40),
              claims: authClaims,
              signingCredentials: signingCredentials
              );

            string token = new JwtSecurityTokenHandler().WriteToken(tokenObject);
            return token;
        }


        //GenerateUserInfoObject
        private UserInfoResult GenerateUserInfoObject(ApplicationUser user, IEnumerable<string> Roles)
        {

            return new UserInfoResult()
            {
                Id = (user.Id),
                FirstName = user.FirstName,
                LastName = user.LastName,
                UserName = user.UserName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Roles = Roles,
                IsBlocked = user.IsBlocked,
            };
        }

    }
}
