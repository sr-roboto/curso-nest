import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    ServeStaticModule.forRoot({
      rootPath: 'public',
    }),
    MongooseModule.forRoot(process.env.MONGO_DB || ''),
    PokemonModule,
    CommonModule,
    SeedModule,
  ],
})
export class AppModule {
  constructor() {
    // console.log(process.env);
  }
}
