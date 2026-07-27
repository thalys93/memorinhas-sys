import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { StoreService } from 'src/store/store.service';
import { ProductType } from 'src/product-types/entities/product-type.entity';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export type ProductListFilters = {
    search?: string;
    productTypeId?: string;
    minValue?: number;
    maxValue?: number;
    freight?: boolean;
};

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductType)
        private readonly productTypeRepository: Repository<ProductType>,
        private readonly storeService: StoreService,
    ) {}

    async paginate(
        authUser: AuthUser,
        options: IPaginationOptions,
        filters: ProductListFilters = {},
    ) {
        const store = await this.storeService.assertStoreAccess(authUser);

        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.store', 'store')
            .leftJoinAndSelect('product.productType', 'productType')
            .andWhere('store.id = :storeId', { storeId: store.id });

        this.applyFilters(queryBuilder, filters);
        queryBuilder.orderBy('product.createdAt', 'DESC');
        return paginate<Product>(queryBuilder, options);
    }

    async paginatePublic(
        brandUrl: string,
        options: IPaginationOptions,
        filters: ProductListFilters = {},
    ) {
        const queryBuilder = this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.store', 'store')
            .leftJoinAndSelect('product.productType', 'productType')
            .andWhere('store.brand_url = :brandUrl', { brandUrl });

        this.applyFilters(queryBuilder, filters);
        queryBuilder.orderBy('product.createdAt', 'DESC');
        return paginate<Product>(queryBuilder, options);
    }

    async findOne(id: string, authUser: AuthUser) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['store', 'productType'],
        });

        if (!product) {
            throw new NotFoundException('api.product.not.found');
        }

        const store = await this.storeService.assertStoreAccess(authUser);
        if (product.store.id !== store.id) {
            throw new NotFoundException('api.product.not.found');
        }

        return { found: product };
    }

    async findOnePublic(brandUrl: string, id: string) {
        const product = await this.productRepository
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.store', 'store')
            .leftJoinAndSelect('product.productType', 'productType')
            .where('product.id = :id', { id })
            .andWhere('store.brand_url = :brandUrl', { brandUrl })
            .getOne();

        if (!product) {
            throw new NotFoundException('api.product.not.found');
        }

        return { found: product };
    }

    async create(createProductDto: CreateProductDto, authUser: AuthUser) {
        const store = await this.storeService.assertStoreAccess(authUser);

        const productType = await this.resolveProductType(
            createProductDto.productTypeId,
            createProductDto.customizableSlots,
        );

        const { productTypeId: _productTypeId, ...productData } =
            createProductDto;

        const product = this.productRepository.create({
            ...productData,
            customizableSlots: productType.isCustomizable
                ? createProductDto.customizableSlots!
                : null,
            store,
            productType,
        });

        await this.productRepository.save(product);
        return { message: 'api.product.created', product };
    }

    async update(
        id: string,
        updateProductDto: UpdateProductDto,
        authUser: AuthUser,
    ) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['store', 'productType'],
        });

        if (!product) {
            throw new NotFoundException('api.product.not.found');
        }

        const store = await this.storeService.assertStoreAccess(authUser);
        if (product.store.id !== store.id) {
            throw new NotFoundException('api.product.not.found');
        }

        const { productTypeId, customizableSlots, ...rest } = updateProductDto;

        Object.assign(product, rest);

        if (productTypeId) {
            const productType = await this.resolveProductType(
                productTypeId,
                customizableSlots ?? product.customizableSlots ?? undefined,
            );
            product.productType = productType;
            product.customizableSlots = productType.isCustomizable
                ? (customizableSlots ?? product.customizableSlots)
                : null;

            if (productType.isCustomizable && !product.customizableSlots) {
                throw new BadRequestException(
                    'api.product.customizable_slots.required',
                );
            }
        } else if (customizableSlots !== undefined) {
            if (product.productType.isCustomizable) {
                product.customizableSlots = customizableSlots;
            } else {
                product.customizableSlots = null;
            }
        }

        await this.productRepository.save(product);
        return { message: 'api.product.updated', product };
    }

    async remove(id: string, authUser: AuthUser) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['store'],
        });

        if (!product) {
            throw new NotFoundException('api.product.not.found');
        }

        const store = await this.storeService.assertStoreAccess(authUser);
        if (product.store.id !== store.id) {
            throw new NotFoundException('api.product.not.found');
        }

        await this.productRepository.delete(id);
        return { message: 'api.product.deleted', productId: id };
    }

    private applyFilters(
        queryBuilder: ReturnType<Repository<Product>['createQueryBuilder']>,
        filters: ProductListFilters,
    ) {
        if (filters.search?.trim()) {
            queryBuilder.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
                search: `%${filters.search.trim()}%`,
            });
        }

        if (filters.productTypeId) {
            queryBuilder.andWhere('productType.id = :productTypeId', {
                productTypeId: filters.productTypeId,
            });
        }

        if (filters.minValue !== undefined) {
            queryBuilder.andWhere('product.value >= :minValue', {
                minValue: filters.minValue,
            });
        }

        if (filters.maxValue !== undefined) {
            queryBuilder.andWhere('product.value <= :maxValue', {
                maxValue: filters.maxValue,
            });
        }

        if (filters.freight !== undefined) {
            queryBuilder.andWhere('product.freight = :freight', {
                freight: filters.freight,
            });
        }
    }

    private async resolveProductType(
        productTypeId: string,
        customizableSlots?: number,
    ) {
        const productType = await this.productTypeRepository.findOne({
            where: { id: productTypeId, active: true },
        });

        if (!productType) {
            throw new NotFoundException('api.product_type.not.found');
        }

        if (productType.isCustomizable && !customizableSlots) {
            throw new BadRequestException(
                'api.product.customizable_slots.required',
            );
        }

        return productType;
    }
}
