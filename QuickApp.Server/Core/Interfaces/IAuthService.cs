using QuickApp.Server.Core.Dtos.Auth;
using QuickApp.Server.Core.Dtos.General;
using System.Security.Claims;

namespace QuickApp.Server.Core.Interfaces
{
    public interface IAuthService
    {
        Task<GeneralServiceResponseDto> SeedRoleAsync();
        Task<GeneralServiceResponseDto> RegisterAsync(RegisterDto registerDto);
        //Task<LoginServiceResponseDto?> LoginAsync(LoginDto loginDto);
        Task<GeneralServiceResponseDto> UpdateRoleAsync(ClaimsPrincipal User, UpdateRoleDto updateRoleDto);
        Task<UserInfoResult> MeAsync(ClaimsPrincipal User);
        Task<IEnumerable<UserInfoResult>> GetUsersListAsync();
        Task<UserInfoResult?> GetUserDetailsByUserNameAsync(string userName);
        Task<string> DeleteByIdAsync(string Id);
        Task<GeneralServiceResponseDto> BlockByIdAsync(string Id);
    }
}
