import axios from "axios";
// import { HOST_API_KEY } from "./globalConfig";
import { environment } from "../environment/environment";

const axiosInstance = axios.create({baseURL:environment()})

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response) || 'General Axios Error happend'
        )
)

export default axiosInstance;