using Microsoft.EntityFrameworkCore;
using OpenIddict.Abstractions;
using QuickApp.Server.Core.DbContext;
using QuickApp.Server.Core.Dtos.Log;
using QuickApp.Server.Core.Entities;
using QuickApp.Server.Core.Interfaces;
using System.Security.Claims;

namespace QuickApp.Server.Core.Services
{
    public class LogService : ILogService
    {
        private readonly ApplicationDbContext _context;

        public LogService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SaveNewLog(string UserName, string Description)
        {
            var newLog = new Log()
            {  
                UserName = UserName,
                Description = Description
            };
            await _context.Logs.AddAsync(newLog);
            await _context.SaveChangesAsync();
        }

        public  async Task<IEnumerable<GetLogDto>> GetLogsAsync()
        {
            var logs = await _context.Logs
                .Select(q => new GetLogDto
                {
                UserName = q.UserName,
                Description = q.Description,
                CreatedAt = q.CreatedAt
                })
                .OrderByDescending(q => q.CreatedAt).ToListAsync();
                return logs;
        }

        public  async Task<IEnumerable<GetLogDto>> GetMyLogsAsync(ClaimsPrincipal User)
        {
     
            var logs = await _context.Logs
                .Where(q => q.UserName == User.Identity.Name )
                .Select(q => new GetLogDto
                {
                    UserName = q.UserName,
                    Description = q.Description,
                    CreatedAt = q.CreatedAt
                })
                .OrderByDescending(q => q.CreatedAt).ToListAsync();
            return logs;
        }

        
    }
}
