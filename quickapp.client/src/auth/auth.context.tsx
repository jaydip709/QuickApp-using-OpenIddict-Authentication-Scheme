import { ReactNode,createContext,useReducer,useCallback,useEffect } from "react";
import { IAuthContext,IAuthContextAction,IAuthContextActionTypes,IAuthContextState,IAuthUser, IUsers } from "../types/auth.types";
import { getSession,setSession } from "./auth.utils";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ME_URL,PATH_AFTER_LOGIN,PATH_AFTER_LOGOUT,PATH_AFTER_REGISTER,REGISTER_URL } from "../utils/globalConfig";
import  { AxiosResponse } from "axios";
import { decodeIdentityToken } from "../services/Jwthelper";
import { OidcService } from "../services/OidcService";


//We need a reducer function for useReducer hook
const authReducer = (state:IAuthContextState,action:IAuthContextAction) => {
    if(action.type === IAuthContextActionTypes.LOGIN){
        return{
        ...state,
        isAuthenticated: true,
        isAuthLoading: false,
        user: action.payload,
        };
    } 
    if(action.type === IAuthContextActionTypes.LOGOUT){
        return{
            ...state,
            isAuthenticated: false,
            isAuthLoading: false,
            user: undefined,
        };
    }
    return state;
};

//We need an initial state object for useReducer hook
const initialAuthState: IAuthContextState ={
    isAuthenticated: false,
    isAuthLoading: true,
    user: undefined,
}

//We create our context here and export it
export const AuthContext = createContext<IAuthContext | null>(null);

//We need an interface for our context props
interface IProps{
    children: ReactNode;
}

// We create a component to manage all auth functionalities and export it and use it
const AuthContextProvider = ({children}: IProps) => {
    const[state, dispatch] = useReducer(authReducer, initialAuthState);
    const navigate = useNavigate();


    //Initialize Method
    const initializeAuthContext = useCallback(async ()=> {
        
        try {
            const token = getSession();
            const id_token = localStorage.getItem("id_token");
          
            if(id_token){
                // validate accessToken by calling backend
                setSession(token);
                const response = await axiosInstance.post<IAuthUser>(ME_URL);
                
                const userInfo:IAuthUser = response.data;
                dispatch({type: IAuthContextActionTypes.LOGIN, payload: response.data});
                console.log(userInfo);
            }else{
                setSession(null);
                dispatch({type: IAuthContextActionTypes.LOGOUT});
            }
            }catch(error){
                // setSession(null);
                dispatch({type: IAuthContextActionTypes.LOGOUT});
            }

    }, []);


    // In start of Application, We call initializeAuthContext to be sure about authentication status
    useEffect(() => {
        initializeAuthContext()
        .then(() => console.log('initializeAuthContext was successfull'))
        .catch((error) => console.log(error));
  },[]);

   // Register Method
   const register = useCallback(async(firstName: string, lastName: string, userName: string, email: string, password: string, confirmPassword: string) => {
    const response = await axiosInstance.post(REGISTER_URL,{
      firstName,
      lastName,
      userName,
      email,
      password,
      confirmPassword,
    });
    console.log('Register Result:', response);
    toast.success('Register was Successfull. Please Login.');
    navigate(PATH_AFTER_REGISTER);
  },[]);

  // Login Method
  const login = useCallback(async(userName: string, password: string) => {

    const response : AxiosResponse = await OidcService({userName,password})

    const accessToken :string = response.data.access_token;
    const id_token = response.data.id_token;

    const idToken :string = response.data.id_token;
    var CURRENT_USER_ID_TOKEN = decodeIdentityToken(idToken);
    const User :IUsers | string ={
      firstname : CURRENT_USER_ID_TOKEN.firstname,
      lastname:CURRENT_USER_ID_TOKEN.lastname,
      email:CURRENT_USER_ID_TOKEN.email,
      role:CURRENT_USER_ID_TOKEN.role,
      username:CURRENT_USER_ID_TOKEN.name,
      id:CURRENT_USER_ID_TOKEN.sub

    }
    console.log(User);
    localStorage.setItem("user",JSON.stringify(CURRENT_USER_ID_TOKEN));
    localStorage.setItem("id_token",id_token);
    console.log(accessToken);
    console.log(response);
    toast.success('Login Was Successful');
    // In response, we receive jwt token and user data
   
    setSession(accessToken);
    (async ()=>{
      const userInfo = await axiosInstance.get(`api/Auth/user?userName=${User.username}`);
      console.log(userInfo);
        // alert("Session is Expired Please Login Again ");
        navigate(PATH_AFTER_LOGIN);
        dispatch({
          type: IAuthContextActionTypes.LOGIN,
          payload: userInfo.data,
        });
    })()

    const expire =  CURRENT_USER_ID_TOKEN .exp;
    const issued =  CURRENT_USER_ID_TOKEN .iat;
   
   setTimeout(() => {
    setSession(null);
    localStorage.removeItem("user");
    localStorage.removeItem("id_token");
    toast.error('Session expired. Please log in again.');
       navigate(PATH_AFTER_LOGOUT);
   }, (expire - issued)*1000);
 
  },[]);

  // Logout Method
  const logout = useCallback(() => {
    setSession(null);
    dispatch({
      type: IAuthContextActionTypes.LOGOUT,
    });
    navigate(PATH_AFTER_LOGOUT);
  }, []);
  
  // We create an object for values of context provider
  // This will keep our code more redable
  const valuesObject = {
    isAuthenticated: state.isAuthenticated,
    isAuthLoading: state.isAuthLoading,
    user: state.user,
    register,
    login,
    logout,
  };
  return <AuthContext.Provider value={valuesObject}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;