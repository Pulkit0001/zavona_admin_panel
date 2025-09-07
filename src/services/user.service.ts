import { Endpoints } from "../data/endpoints.enum";
import apiService from "./api.service";

export const getUsers = async(page:any , limit:any ,search:any ) => {
    try {
        const apiRes= await apiService.get(`${Endpoints.GET_USERS}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`, {});
        return apiRes;
    } catch (error:any) {
        throw error
    }
}

export const getUserDetails = async(userId:string) => {
    try {
        const apiRes= await apiService.get(`${Endpoints.GET_USER_DETAILS}/${userId}`, {});
        return apiRes;
    } catch (error:any) {
        throw error
    }
}

export const updateUser = async(userId:string , payload:any) => {
    try {
        const apiRes= await apiService.put(`${Endpoints.GET_USERS}/${userId}`, payload);
        return apiRes;
    } catch (error:any) {
        throw error
    }
}


