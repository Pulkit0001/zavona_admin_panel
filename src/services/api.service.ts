// apiService.ts

import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
// import { removeCookie, getCookie } from '../utils/helper.util';
import { getCookie, removeCookie } from '../utils/helper.utils';
import { Constants } from '../data/constants';
import { ApiStatus } from '../data/api-status.enum';
import { Path } from '../data/path.enum';

const BASE_URL = import.meta.env.VITE_BASE_URL; // Your API base URL

// Define a generic function to handle API requests
async function request<T>(method: string, endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    
    const userToken = getCookie(Constants.USER_TOKEN_COOKIE)

    const headers = {
      // withCredentials: true ,
      'Authorization': userToken ? `Bearer ${userToken}` : null,
      "ngrok-skip-browser-warning": "69420",
    } ;
  
    // if (config?.data?.runInForeground) {
    //   ContextManager.showLoader()  
    // }
   
    try {
      const response: AxiosResponse<T> = await axios.request<T>({
      method,
      url: `${BASE_URL}${endpoint}`,
      // url: `${config?.baseURL || BASE_URL}${endpoint}`,
      data,
      headers ,
      // ...config,
      // withCredentials: true ,
      });
      return response.data;
    } 
    catch (error: any) {
      throw  handleApiError(error);
      // throw new Error(`Error ${method}ing data: ${error.message}`);
    } 
    finally {
    //   if (config?.data?.runInForeground) {
    //   ContextManager.hideLoader()
    //   }
    }
}

// Handle common API errors
function handleApiError(error: AxiosError) {
  console.log(error)
  if (error.response) {
    switch (error.response.status) {
      case ApiStatus.NOT_AUTHORIZED:
        removeCookie(Constants.USER_TOKEN_COOKIE)
        window.location.href = `${Path.LOGIN}`
        break;
      
      case ApiStatus.FORBIDDEN,
        ApiStatus.INTERNAL_SERVER_ERROR,
        ApiStatus.NOT_FOUND:
        // Todo
        break;
    
      default:
        break;
    }
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
    return error.response.data

  } else if (error.request) {
    // The request was made but no response was received
    console.error('API No Response:', error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error:', error.message);
    return error.message

  }
  console.error('Config:', error.config);
  return { message: "Something went wrong. Please try again later."}

}

// Define common methods for GET, POST, PUT, and DELETE requests
const apiService = {
  async get<T>(endpoint: string, config?: AxiosRequestConfig,): Promise<T> {
    return request<T>('GET', endpoint, undefined, config, );
  },

  async post<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return request<T>('POST', endpoint, data, config);
  },

  async put<T>(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<T> {
    return request<T>('PUT', endpoint, data, config);
  },

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return request<T>('PATCH', endpoint, data, config);
  },

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<T> {
    return request<T>('DELETE', endpoint, undefined, config);
  },
};

export default apiService;
