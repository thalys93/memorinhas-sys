import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { In, Repository } from 'typeorm';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { StoreService } from 'src/store/store.service';
import { ProductType } from 'src/product-types/entities/product-type.entity';
import { ProductAttributeField } from 'src/product-attribute-fields/entities/product-attribute-field.entity';
import { ProductAttributeFieldType } from 'src/enums/ProductAttributeFieldType';
import { Product } from './entities/product.entity';
import {
    CreateProductDto,
    ProductAttributeDto,
    ProductAttributeType,
    ProductAttributeValue,
} from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export type ProductListFilters = {
    search?: string;
    productTypeId?: string;
    minValue?: number;
    maxValue?: number;
    freight?: boolean;
};

type NormalizedAttribute = {
    fieldId: string | null;
    type: ProductAttributeType;
    label: string;
    value: ProductAttributeValue;
};

const HEX_COLOR_RE = /^#([0-9a-fA-F]{6})$/;

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(ProductType)
        private readonly productTypeRepository: Repository<ProductType>,
        @InjectRepository(ProductAttributeField)
        private readonly attributeFieldRepository: Repository<ProductAttributeField>,
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

        const { productTypeId: _productTypeId, attributes, ...productData } =
            createProductDto;

        const product = this.productRepository.create({
            ...productData,
            attributes: await this.normalizeAttributes(attributes),
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

        const { productTypeId, customizableSlots, attributes, ...rest } =
            updateProductDto;

        Object.assign(product, rest);

        if (attributes !== undefined) {
            product.attributes = await this.normalizeAttributes(attributes);
        }

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

    private async normalizeAttributes(
        attributes?: ProductAttributeDto[],
    ): Promise<NormalizedAttribute[]> {
        if (!attributes?.length) {
            return [];
        }

        const fieldIds = [
            ...new Set(
                attributes
                    .map((row) => row.fieldId)
                    .filter((id): id is string => Boolean(id)),
            ),
        ];

        const fields = fieldIds.length
            ? await this.attributeFieldRepository.find({
                  where: { id: In(fieldIds) },
              })
            : [];

        const fieldsById = new Map(fields.map((field) => [field.id, field]));
        const usedFieldIds = new Set<string>();
        const normalized: NormalizedAttribute[] = [];

        for (const row of attributes) {
            const label = row.label?.trim();
            if (!label) {
                throw new BadRequestException(
                    'api.product.attribute.label.required',
                );
            }

            if (!row.fieldId || row.type === 'legacy') {
                normalized.push(this.toLegacyAttribute(label, row.value));
                continue;
            }

            if (usedFieldIds.has(row.fieldId)) {
                throw new BadRequestException(
                    'api.product.attribute.field.duplicate',
                );
            }

            const field = fieldsById.get(row.fieldId);
            if (!field) {
                normalized.push(this.toLegacyAttribute(label, row.value));
                continue;
            }

            usedFieldIds.add(field.id);
            normalized.push({
                fieldId: field.id,
                type: field.type,
                label: field.name,
                value: this.validateAttributeValue(field, row.value),
            });
        }

        return normalized;
    }

    private toLegacyAttribute(
        label: string,
        value: ProductAttributeValue,
    ): NormalizedAttribute {
        const text =
            typeof value === 'string'
                ? value.trim()
                : Array.isArray(value)
                  ? value.map(String).join(', ')
                  : String(value);

        if (!text) {
            throw new BadRequestException(
                'api.product.attribute.value.required',
            );
        }

        return {
            fieldId: null,
            type: 'legacy',
            label,
            value: text,
        };
    }

    private validateAttributeValue(
        field: ProductAttributeField,
        value: ProductAttributeValue,
    ): ProductAttributeValue {
        switch (field.type) {
            case ProductAttributeFieldType.Text: {
                if (typeof value !== 'string' || !value.trim()) {
                    throw new BadRequestException(
                        'api.product.attribute.value.invalid',
                    );
                }
                return value.trim();
            }
            case ProductAttributeFieldType.Number: {
                const num =
                    typeof value === 'number' ? value : Number(value);
                if (!Number.isFinite(num)) {
                    throw new BadRequestException(
                        'api.product.attribute.value.invalid',
                    );
                }
                return num;
            }
            case ProductAttributeFieldType.Boolean: {
                if (typeof value !== 'boolean') {
                    throw new BadRequestException(
                        'api.product.attribute.value.invalid',
                    );
                }
                return value;
            }
            case ProductAttributeFieldType.ColorList: {
                if (!Array.isArray(value) || value.length === 0) {
                    throw new BadRequestException(
                        'api.product.attribute.value.invalid',
                    );
                }
                const colors = value.map((item) => {
                    const hex = String(item).trim().toUpperCase();
                    if (!HEX_COLOR_RE.test(hex)) {
                        throw new BadRequestException(
                            'api.product.attribute.value.invalid',
                        );
                    }
                    return hex;
                });
                return colors;
            }
            case ProductAttributeFieldType.Select: {
                if (!Array.isArray(value) || value.length === 0) {
                    throw new BadRequestException(
                        'api.product.attribute.value.invalid',
                    );
                }
                const allowed = new Set(field.options);
                const selected = value.map((item) => String(item).trim());
                if (
                    selected.some((item) => !item || !allowed.has(item)) ||
                    new Set(selected).size !== selected.length
                ) {
                    throw new BadRequestException(
                        'api.product.attribute.value.invalid',
                    );
                }
                return selected;
            }
            default:
                throw new BadRequestException(
                    'api.product.attribute.value.invalid',
                );
        }
    }
}
