import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { ProductType } from './entities/product-type.entity';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';

@Injectable()
export class ProductTypesService {
    constructor(
        @InjectRepository(ProductType)
        private readonly productTypeRepository: Repository<ProductType>,
    ) {}

    async paginate(options: IPaginationOptions, activeOnly = false) {
        const queryBuilder =
            this.productTypeRepository.createQueryBuilder('productType');

        if (activeOnly) {
            queryBuilder.andWhere('productType.active = :active', {
                active: true,
            });
        }

        queryBuilder.orderBy('productType.name', 'ASC');
        return paginate<ProductType>(queryBuilder, options);
    }

    async findActive() {
        return this.productTypeRepository.find({
            where: { active: true },
            order: { name: 'ASC' },
        });
    }

    async findOne(id: string) {
        const productType = await this.productTypeRepository.findOne({
            where: { id },
        });

        if (!productType) {
            throw new NotFoundException('api.product_type.not.found');
        }

        return { found: productType };
    }

    async create(dto: CreateProductTypeDto) {
        const existing = await this.productTypeRepository.findOne({
            where: { name: dto.name },
        });

        if (existing) {
            throw new ConflictException('api.product_type.name.taken');
        }

        const productType = this.productTypeRepository.create({
            name: dto.name,
            isCustomizable: dto.isCustomizable ?? false,
            active: dto.active ?? true,
        });

        await this.productTypeRepository.save(productType);
        return { message: 'api.product_type.created', productType };
    }

    async update(id: string, dto: UpdateProductTypeDto) {
        const productType = await this.productTypeRepository.findOne({
            where: { id },
        });

        if (!productType) {
            throw new NotFoundException('api.product_type.not.found');
        }

        if (dto.name && dto.name !== productType.name) {
            const existing = await this.productTypeRepository.findOne({
                where: { name: dto.name },
            });
            if (existing) {
                throw new ConflictException('api.product_type.name.taken');
            }
        }

        Object.assign(productType, dto);
        await this.productTypeRepository.save(productType);
        return { message: 'api.product_type.updated', productType };
    }

    async softDelete(id: string) {
        const productType = await this.productTypeRepository.findOne({
            where: { id },
        });

        if (!productType) {
            throw new NotFoundException('api.product_type.not.found');
        }

        productType.active = false;
        await this.productTypeRepository.save(productType);
        return { message: 'api.product_type.deactivated', productType };
    }
}
