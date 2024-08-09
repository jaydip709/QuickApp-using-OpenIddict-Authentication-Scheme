using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using OpenIddict.Server.AspNetCore;
using QuickApp.Server.Core.Entities;
using static OpenIddict.Abstractions.OpenIddictConstants;
using OpenIddict.Abstractions;
using System.Security.Claims;

namespace QuickApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthOidcController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;

        private readonly SignInManager<ApplicationUser> _signInManager;

        public AuthOidcController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            _userManager = userManager;
            _signInManager = signInManager;
        }



        [HttpPost("~/connect/token")]
        public async Task<IActionResult> Exchange()
        {
            var request = HttpContext.GetOpenIddictServerRequest()
                ?? throw new InvalidOperationException("OpenID connect request can't be retervied.");

            if (request.IsPasswordGrantType())
            {
                if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                    return BadRequest("Username or password can't be empty.");
                var use = request.Username;

                var user = await _userManager.FindByNameAsync(request.Username);

                if (user == null)
                    return BadRequest("Please check the username and password is correct.");

                var result =
                    await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);

                if (result.IsLockedOut)
                    return BadRequest("Specified user account has been suspended.");
                if (user.IsBlocked)
                    return BadRequest("BLocked User");

                if (result.IsNotAllowed)
                    return BadRequest("Specified user is not allowed to sign in.");

                if (!result.Succeeded)
                    return BadRequest("Please check that your username and password is correct.");

                var principal = await CreateClaimsPrincipalAsync(user, request.GetScopes());

                return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
            }
            else if (request.IsRefreshTokenGrantType())
            {
                var result =
                    await HttpContext.AuthenticateAsync(OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);

                var userId = result?.Principal?.GetClaim(Claims.Subject);
                var user = userId != null ? await _userManager.FindByIdAsync(userId) : null;

                if (user == null)
                    return BadRequest("Refresh token is no longer valid.");

                if (!await _signInManager.CanSignInAsync(user))
                    return BadRequest("The user is no longer allowed to sign in.");

                var scopes = request.GetScopes();
                if (scopes.Length == 0 && result?.Principal != null)
                    scopes = result.Principal.GetScopes();

                var principal = await CreateClaimsPrincipalAsync(user, scopes);
                return SignIn(principal, OpenIddictServerAspNetCoreDefaults.AuthenticationScheme);
            }

            throw new InvalidOperationException($"Specified grant type \"{request.GrantType}\" is not supported.");
        }

        private async Task<ClaimsPrincipal> CreateClaimsPrincipalAsync(ApplicationUser user, IEnumerable<string> scopes)
        {
            var principal = await _signInManager.CreateUserPrincipalAsync(user);
            principal.SetScopes(scopes);

            var identity = principal.Identity as ClaimsIdentity
                ?? throw new InvalidOperationException("ClaimsPrincipal's Identity is null.");

            if (user.FirstName != null) identity.SetClaim("firstname", user.FirstName);
            if (user.LastName != null) identity.SetClaim("lastname", user.LastName);
            if (user.CreatedAt != null) identity.SetClaim("Createdat", Convert.ToString(user.CreatedAt));

            principal.SetDestinations(GetDestinations);

            return principal;
        }


        private static IEnumerable<string> GetDestinations(Claim claim)
        {
            if (claim.Subject == null)
                throw new InvalidOperationException("The Claim's Subject is null.");

            switch(claim.Type)
            {
                case Claims.Name:
                    yield return Destinations.AccessToken;
                    if (claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case Claims.Email:
                    yield return Destinations.AccessToken;
                    if (claim.Subject.HasScope(Scopes.Email))
                        yield return Destinations.IdentityToken;

                    yield break;

                case "firstname":
                    if(claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case "lastname":
                    if (claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case "Createdat":
                    if (claim.Subject.HasScope(Scopes.Profile))
                        yield return Destinations.IdentityToken;

                    yield break;

                case Claims.Role:
                    yield return Destinations.AccessToken;

                    if (claim.Subject.HasScope(Scopes.Roles))
                        yield return Destinations.IdentityToken;

                    yield break;


                // IdentityOptions.ClaimsIdentity.SecurityStampClaimType
                case "AspNet.Identity.SecurityStamp":
                    // Never include the security stamp in the access and identity tokens, as it's a secret value.
                    yield break;

                default:
                    yield return Destinations.AccessToken;
                    yield break;
            }
        }
    }
}
