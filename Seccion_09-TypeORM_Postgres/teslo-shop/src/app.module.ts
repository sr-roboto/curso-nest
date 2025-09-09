import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfiguration } from './config/env.config';
import { ConfigService } from '@nestjs/config';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [EnvConfiguration], isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('dbHost'),
        port: configService.get<number>('dbPort'),
        username: configService.get('dbUser'),
        password: configService.get('dbPassword'),
        database: configService.get('dbName'),
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    ProductsModule,
  ],
})
export class AppModule {}
