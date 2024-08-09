using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using QuickApp.Server.Core.Entities;

namespace QuickApp.Server.Core.DbContext
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Log>Logs { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


            //Config anything we want

            //1
            builder.Entity<ApplicationUser>(e =>
            {
                e.ToTable("Users");
            });

            //2
            builder.Entity<IdentityUserClaim<String>>(e =>
            {
                e.ToTable("UserClaims");
            });

            //3
            builder.Entity<IdentityUserLogin<String>>(e =>
            {
                e.ToTable("UserLogins");
            });

            //4
            builder.Entity<IdentityUserToken<String>>(e =>
            {
                e.ToTable("UserTokens");
            });

            //5
            builder.Entity<IdentityRole>(e =>
            {
                e.ToTable("Roles");
            });

            //6
            builder.Entity<IdentityRoleClaim<String>>(e =>
            {
                e.ToTable("RoleClaims");
            });

            //7
            builder.Entity<IdentityUserRole<String>>(e =>
            {
                e.ToTable("UserRoles");
            });
        }
    }
}
