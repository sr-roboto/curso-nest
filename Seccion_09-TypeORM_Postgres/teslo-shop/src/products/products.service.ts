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
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDeails } = createProductDto;
      const product = this.productRepository.create({
        ...productDeails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    try {
      const products = await this.productRepository.find({
        take: paginationDto.limit,
        skip: paginationDto.offset,
        relations: {
          images: true,
        },
      });
      return products.map(({ images, ...rest }) => ({
        ...rest,
        images: images?.map((img) => img.url),
      }));
    } catch (error) {
      this.handleDbExceptions(error);
    }
  }

  async findOne(term: string) {
    let product: Product | null;

    // Buscar por UUID
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    }
    // Buscar por slug
    else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
      // product = await this.productRepository.findOneBy({ slug: term });
    }

    if (!product) {
      throw new NotFoundException(`Product with term "${term}" not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
      images: [],
    });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    try {
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.logger.error(error);

      this.handleDbExceptions(error);
    }
  }

  async remove(id: string) {
    const foundProduct = await this.findOne(id);

    await this.productRepository.softRemove(foundProduct);
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

  async findOnePlain(term: string) {
    const { images = [], ...rest } = await this.findOne(term);
    return {
      ...rest,
      images: images.map((img) => img.url),
    };
  }
}
