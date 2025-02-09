import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>

  ){}

  create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      
      const createdPokemon = new this.pokemonModel( createPokemonDto );
      return createdPokemon;

    } catch ( error ) {
      
      if ( error.code === 11000 ) {
        throw new BadRequestException(
          `Pokemon already exists ${ JSON.stringify( error.keyValue ) }`
        );
      }
      console.log( error );
      throw new InternalServerErrorException(`Error creating pokemon ${ error }`);

    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(searchTerm:string) {

    let pokemon:Pokemon | null = null;

    if( !isNaN( +searchTerm ) ) {
      pokemon = await this.pokemonModel.findOne({ no: +searchTerm })  
    }
    
    if( !pokemon && isValidObjectId( searchTerm ) ) {
      pokemon = await this.pokemonModel.findById( searchTerm );
    }

    if( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: searchTerm.toLocaleLowerCase() });
    }

    if( !pokemon ) throw new NotFoundException(`Pokemon with ${ searchTerm } not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );

    if( updatePokemonDto.name ){ updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase(); }

    await pokemon.updateOne( updatePokemonDto, { new:true });

    return { ...pokemon.toJSON(), ...updatePokemonDto };
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
