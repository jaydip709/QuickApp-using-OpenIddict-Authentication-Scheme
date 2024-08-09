using OpenIddict.Abstractions;
using static OpenIddict.Abstractions.OpenIddictConstants;

namespace QuickApp.Server.Configuration
{
    public static class OidcServerConfig
    {
        public const string ServerName = "QuickApp";
        public const string QuickClientID = "quick_spa";
        public const string SwaggerClientID = "swagger_ui";

        public static async Task RegisterClientApplicationAsync(IServiceProvider provider)
        {
            var manager = provider.GetRequiredService<IOpenIddictApplicationManager>();

            if (await manager.FindByClientIdAsync(QuickClientID) is null)
            {
                await manager.CreateAsync(new OpenIddictApplicationDescriptor
                {
                    ClientId = QuickClientID,
                    ClientType = ClientTypes.Public,
                    DisplayName = "Quick",
                    Permissions =
                    {
                        Permissions.Endpoints.Token,
                        Permissions.GrantTypes.Password,
                        Permissions.GrantTypes.RefreshToken,
                        Permissions.Scopes.Profile,
                        Permissions.Scopes.Email,
                        Permissions.Scopes.Address,
                        Permissions.Scopes.Phone,
                        Permissions.Scopes.Roles
                    }
                });
            }
        }
    }
}
