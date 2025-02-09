import { Injectable } from '@nestjs/common';
import axios, { type AxiosInstance } from 'axios';

import { type PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  private readonly axios:AxiosInstance = axios;

  async execute() {
    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/');
      const no:number = +segments[ segments.length - 2 ];

    });

    return data.results;
  }


}
