import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);

      return newPokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    let findPokemons = await this.pokemonModel.find();

    return findPokemons;
  }

  async findOne(id: string) {
    if (isValidObjectId(id)) {
      const pokemon = await this.pokemonModel.findById(id);
      if (pokemon) return pokemon;
    }
    throw new NotFoundException(`Pokemon with id ${id} not found`);
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    if (!isValidObjectId(id))
      throw new NotFoundException(`Pokemon with id ${id} not found`);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
    }

    try {
      const pokemonUpdate = await this.pokemonModel.findByIdAndUpdate(
        id,
        updatePokemonDto,
        { new: true },
      );
      console.log(pokemonUpdate);
      if (!pokemonUpdate)
        throw new NotFoundException(`Pokemon with id ${id} not found`);

      return pokemonUpdate;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne({
      _id: id,
    });

    if (deletedCount === 0) throw new BadRequestException('Pokemon not found');

    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon exists in db${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Cant create pokemon - check server logs`,
    );
  }
}
