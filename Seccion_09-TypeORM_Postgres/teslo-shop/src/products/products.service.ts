import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll() {
    try {
      const products = this.productRepository.find();
      return products;
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findOne(id: string) {
    try {
      const foundProduct = await this.productRepository.findOneBy({ id });
      if (!foundProduct) {
        throw new NotFoundException('Not found product with ID ' + id);
      }
      return foundProduct;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const foundProduct = await this.productRepository.findBy({ id });
    await this.productRepository.softRemove(foundProduct);
    return { message: `Product with id ${id} removed` };
  }

  private handleDbExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(`${error.detail}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
