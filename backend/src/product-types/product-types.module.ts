import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductType } from './entities/product-type.entity';
import {
    ProductTypesController,
    ProductTypesControllerPublic,
} from './product-types.controller';
import { ProductTypesService } from './product-types.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductType])],
    controllers: [ProductTypesController, ProductTypesControllerPublic],
    providers: [ProductTypesService],
    exports: [ProductTypesService, TypeOrmModule],
})
export class ProductTypesModule {}
