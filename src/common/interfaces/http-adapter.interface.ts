import { type AxiosRequestConfig } from 'axios';


export interface HttpAdapter {
  get<T>( url:string, config?:AxiosRequestConfig ):Promise<T>
}


