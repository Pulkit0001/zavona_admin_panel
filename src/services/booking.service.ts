import { Endpoints } from "../data/endpoints.enum";
import apiService from "./api.service";

export const getBookings = async(page:any , limit:any ,search:any ) => {
    try {
        const apiRes= await apiService.get(`${Endpoints.GET_BOOKINGS}?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`, {});
        return apiRes;
    } catch (error:any) {
        throw error
    }
}

export const getBookingDetails = async (id: string) => {
    try {
        const apiRes = await apiService.get(`${Endpoints.GET_BOOKINGS}/${id}`, {});
        return apiRes;
    } catch (error: any) {
        throw error
    }
}
