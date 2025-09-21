import { Endpoints } from "../data/endpoints.enum";
import apiService from "./api.service";

export const getParkings = async(page:any , limit:any ,search:any ) => {
    try {
        const apiRes= await apiService.get(`${Endpoints.GET_PARKINGS}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`, {});
        return apiRes;
    } catch (error:any) {
        throw error
    }
}

export const getParkingDetails = async (id: string) => {
    try {
        const apiRes = await apiService.get(`${Endpoints.GET_PARKINGS}/${id}`, {});
        return apiRes;
    } catch (error: any) {
        throw error
    }
}

export const updateParking = async(parkingId:string , payload:any) => {
    try {
        const apiRes= await apiService.put(`${Endpoints.GET_PARKINGS}/${parkingId}`, payload);
        return apiRes;
    } catch (error:any) {
        throw error
    }
}

export const getDocuments = async (fileUrl: string) => {
    try {
        const apiRes = await apiService.get(`${Endpoints.GET_DOCUMENTS}/${fileUrl}`, {});
        return apiRes;
    } catch (error: any) {
        throw error
    }
}
