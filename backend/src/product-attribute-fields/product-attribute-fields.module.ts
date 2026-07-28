import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributeField } from './entities/product-attribute-field.entity';
import {
    ProductAttributeFieldsController,
    ProductAttributeFieldsControllerPublic,
} from './product-attribute-fields.controller';
import { ProductAttributeFieldsService } from './product-attribute-fields.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProductAttributeField])],
    controllers: [
        ProductAttributeFieldsController,
        ProductAttributeFieldsControllerPublic,
    ],
    providers: [ProductAttributeFieldsService],
    exports: [ProductAttributeFieldsService, TypeOrmModule],
})
export class ProductAttributeFieldsModule {}
