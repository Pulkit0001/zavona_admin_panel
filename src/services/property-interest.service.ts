import { Endpoints } from "../data/endpoints.enum";
import apiService from "./api.service";

export const getPropertyInterests = async(page:any , limit:any ,search:any ) => {
    try {
        const apiRes= await apiService.get(`${Endpoints.GET_PROPERTY_INTERESTS}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`, {});
        return apiRes;
    } catch (error:any) {
        throw error
    }
};

export const getPropertyInterestDetails = async (id: string) => {
    try {
        const apiRes = await apiService.get(`${Endpoints.GET_PROPERTY_INTERESTS}/${id}`, {});
        return apiRes;
    } catch (error: any) {
        throw error
    }
}


