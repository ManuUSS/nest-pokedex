import { Injectable } from '@nestjs/common';
import axios, { type AxiosRequestConfig, type AxiosInstance } from 'axios';

import { type HttpAdapter } from '../interfaces/http-adapter.interface';


@Injectable()
export class AxiosAdapter implements HttpAdapter {

  private axios:AxiosInstance = axios;

  async get<T>( url:string, config:AxiosRequestConfig ):Promise<T> {
    try {
      const { data } = await this.axios.get<T>( url, config );
      return data;
    } catch ( error ) {
      throw new Error( error );
    }
  };
};


