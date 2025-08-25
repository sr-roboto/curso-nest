import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getAllCars() {
    return this.carsService.findAll();
  }

  @Get(':id')
  getCarById(@Param('id', ParseUUIDPipe) id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  createCar(@Body() payload: any) {
    return payload;
  }

  @Patch(':id')
  updateCar(@Param('id', ParseUUIDPipe) id: string, @Body() payload: any) {
    return payload;
  }

  @Delete(':id')
  deleteCar(@Param('id', ParseUUIDPipe) id: string) {
    return `This action removes a car with ID ${id}`;
  }
}
