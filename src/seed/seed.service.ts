import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import axios, { type AxiosInstance } from 'axios';

import { type PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {

  private readonly axios:AxiosInstance = axios;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>
  ) {}

  async execute() {
    const { data } = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);


    data.results.forEach( async ({ name, url }) => {

      const segments = url.split('/');
      const no:number = +segments[ segments.length - 2 ]; 

      // Inefficient way to create a document
      await this.pokemonModel.create({ name, no });

    });

    return data.results;
  }


}
