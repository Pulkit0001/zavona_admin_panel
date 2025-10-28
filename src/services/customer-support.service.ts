import { Endpoints } from "../data/endpoints.enum";
import apiService from "./api.service";

export const customerSupport = async (body: any) => {
    try {
        const apiRes = await apiService.post(`${Endpoints.CUSTOMER_SUPPORT}`, body);
        return apiRes;
    } catch (error: any) {
        throw error
    }
}