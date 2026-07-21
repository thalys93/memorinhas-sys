import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    ProductControllerProtected,
    ProductControllerPublic,
} from './product.controller';
import { ProductService } from './product.service';
import { Product } from './entities/product.entity';
import { ProductType } from 'src/product-types/entities/product-type.entity';
import { StoreModule } from 'src/store/store.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductType]),
        StoreModule,
    ],
    controllers: [ProductControllerProtected, ProductControllerPublic],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}
