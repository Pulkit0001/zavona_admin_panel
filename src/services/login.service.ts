import { Endpoints } from "../data/endpoints.enum";
import apiService from "./api.service";


export const sendOtp = async(body:any) => {
    try {
        const apiRes= await apiService.post(Endpoints.SEND_OTP, body , {data: {runInForeground: true}});
        return apiRes;
    } catch (error:any) {
        throw error
    }
}

export const verifyOtp = async(body:any) => {
    try {
        const apiRes= await apiService.post(Endpoints.VERIFY_OTP, body , {data: {runInForeground: true}});
        return apiRes;
    } catch (error:any) {
        throw error
    }
}

export const logout = async(body:any) => {
    try {
        const apiRes= await apiService.post(Endpoints.LOGOUT, body , {data: {runInForeground: true}});
        return apiRes;
    } catch (error:any) {
        throw error
    }
}




