import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Car } from './interfaces/car.interface';
import { v4 as uuid } from 'uuid';
import { CreateCarDto, UpdateCarDto } from './dto/index';

@Injectable()
export class CarsService {
  private cars: Car[] = [
    { id: uuid(), brand: 'Toyota', model: 'Corolla' },
    { id: uuid(), brand: 'Honda', model: 'Civic' },
    { id: uuid(), brand: 'Ford', model: 'Focus' },
  ];

  findAll() {
    return this.cars;
  }

  findOne(id: string) {
    const car = this.cars.find((car) => car.id === id);

    if (!car) throw new NotFoundException(`Car with ID ${id} not found`);

    return car;
  }

  createCar(createCarDto: CreateCarDto) {
    const newCar: Car = {
      id: uuid(),
      model: createCarDto.model,
      brand: createCarDto.brand,
    };
    this.cars.push(newCar);
    return newCar;
  }

  updateCar(id: string, updateCarDto: UpdateCarDto) {
    let foundCar = this.findOne(id);

    this.cars = this.cars.map((car) => {
      if (car.id === id) {
        foundCar = {
          ...foundCar,
          ...updateCarDto,
          id,
        };
        return foundCar;
      }
      return car;
    });
    return foundCar;
  }

  deleteCar(id: string) {
    let foundCar = this.findOne(id);
    if (!foundCar) throw new BadRequestException(`Car with ID ${id} not found`);

    this.cars = this.cars.filter((car) => car.id !== id);
  }
}
