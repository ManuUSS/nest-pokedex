import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { type PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { type HttpAdapter } from 'src/common/interfaces/http-adapter.interface';

@Injectable()
export class SeedService {


  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>,
    private readonly http:HttpAdapter
  ) {}

  async execute() {

    await this.pokemonModel.deleteMany({});

    const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);

    // const insertPromisesArray: Promise<Pokemon>[] = [];

    const pokemonsToInsert: { name:string, no:number }[] = [];

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/');
      const no:number = +segments[ segments.length - 2 ]; 

      // Inefficient way to create a document
      // await this.pokemonModel.create({ name, no });

      // More efficient way to create a document
      // insertPromisesArray.push( 
      //   this.pokemonModel.create({ name, no })
      // );

      // Optimal way to create a document
      pokemonsToInsert.push({ name, no });

    });

    // await Promise.all( insertPromisesArray );
    await this.pokemonModel.insertMany( pokemonsToInsert );

    return data.results;
  }


}
