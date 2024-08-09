import { ILoginDto, ILoginResponseDto } from "../types/auth.types";
import axiosInstance from "../utils/axiosInstance";


export const OidcService = async (LoginData:ILoginDto) =>{

    const header = {"Content-Type": "application/x-www-form-urlencoded"};
    const data = new URLSearchParams();
    const client_id = "quick_spa"
    const scope = "openid email profile roles offline_access";
    
    data.append("client_id",client_id);
    data.append("grant_type","password");
    data.append("username",LoginData.userName);
    data.append("password",LoginData.password);
    data.append("scope",scope);
    
    const response = await axiosInstance.post<ILoginResponseDto>("/connect/token" ,
        data,
        {headers:header}
    );
    return response;
}