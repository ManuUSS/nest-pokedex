import { 
  BadRequestException, 
  Injectable, 
  InternalServerErrorException, 
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dtio/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit:number;

  constructor(

    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>,
    private readonly configService:ConfigService
  ){
    this.defaultLimit = this.configService.get<number>('DEFAULT_LIMIT')!;
  }

  create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      
      const createdPokemon = new this.pokemonModel( createPokemonDto );
      return createdPokemon;

    } catch ( error ) {
      this.handleExceptions( error );
    }
  }


  findAll( paginationDto:PaginationDto ) {

    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .skip( offset )
      .limit( limit )
      .sort({ no: 1 })
      .select('-__v')
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

    try {
      await pokemon.updateOne( updatePokemonDto, { new:true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch ( error ) {
      this.handleExceptions( error );
    }
    
  }

  async remove(id:string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if( deletedCount === 0 ) {
      throw new BadRequestException(`Pokemon with ID ${ id } not found`);
    }

    return;

  }

  private handleExceptions( error:any ){
    if ( error.code === 11000 ) {
      throw new BadRequestException(
        `Pokemon already exists ${ JSON.stringify( error.keyValue ) }`
      );
    }
    console.log( error );
    throw new InternalServerErrorException(`Error creating pokemon ${ error }`);
  } 

}
