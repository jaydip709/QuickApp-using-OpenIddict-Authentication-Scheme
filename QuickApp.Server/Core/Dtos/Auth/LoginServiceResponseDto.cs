namespace QuickApp.Server.Core.Dtos.Auth
{
    public class LoginServiceResponseDto
    {
        //public string NewToken { get; set; }

        // This will be returned to frontend

        public UserInfoResult UserInfo { get; set; }
    }
}
