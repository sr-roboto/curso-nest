import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BrandsService {
  private brands: Brand[] = [
    // { id: uuid(), name: 'Toyota', createdAt: Date.now() },
    // { id: uuid(), name: 'Honda', createdAt: Date.now() },
    // { id: uuid(), name: 'Ford', createdAt: Date.now() },
  ];

  create(createBrandDto: CreateBrandDto) {
    const { name } = createBrandDto;

    const newBrand: Brand = {
      id: uuid(),
      name: name.toLocaleLowerCase(),
      createdAt: Date.now(),
    };
    this.brands.push(newBrand);
    return newBrand;
  }

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const foundBrand = this.brands.find((brand) => brand.id === id);

    if (!foundBrand)
      throw new NotFoundException(`Brand with ID ${id} not found`);

    return foundBrand;
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {
    let foundBrand = this.findOne(id);

    this.brands = this.brands.map((brand) => {
      if (brand.id === id) {
        foundBrand = {
          ...foundBrand,
          ...updateBrandDto,
          id,
          updatedAt: Date.now(),
        };
        return foundBrand;
      }
      return brand;
    });
    return foundBrand;
  }

  remove(id: string) {
    const foundBrand = this.findOne(id);
    if (!foundBrand)
      throw new NotFoundException(`Brand with ID ${id} not found`);
    this.brands = this.brands.filter((brand) => brand.id !== id);
  }

  fillBrandsWithSeedData(brands: Brand[]) {
    this.brands = brands;
  }
}
