import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { Repository } from 'typeorm';
import { ProductAttributeFieldType } from 'src/enums/ProductAttributeFieldType';
import { ProductAttributeField } from './entities/product-attribute-field.entity';
import { CreateProductAttributeFieldDto } from './dto/create-product-attribute-field.dto';
import { UpdateProductAttributeFieldDto } from './dto/update-product-attribute-field.dto';

@Injectable()
export class ProductAttributeFieldsService {
    constructor(
        @InjectRepository(ProductAttributeField)
        private readonly fieldRepository: Repository<ProductAttributeField>,
    ) {}

    async paginate(options: IPaginationOptions) {
        const queryBuilder = this.fieldRepository
            .createQueryBuilder('field')
            .orderBy('field.sortOrder', 'ASC')
            .addOrderBy('field.name', 'ASC');

        return paginate<ProductAttributeField>(queryBuilder, options);
    }

    async findActive() {
        return this.fieldRepository.find({
            where: { active: true },
            order: { sortOrder: 'ASC', name: 'ASC' },
        });
    }

    async findOne(id: string) {
        const field = await this.fieldRepository.findOne({ where: { id } });

        if (!field) {
            throw new NotFoundException('api.product_attribute_field.not.found');
        }

        return { found: field };
    }

    async create(dto: CreateProductAttributeFieldDto) {
        await this.assertUniqueName(dto.name);
        const options = this.normalizeOptions(dto.type, dto.options);

        const field = this.fieldRepository.create({
            name: dto.name.trim(),
            type: dto.type,
            options,
            active: dto.active ?? true,
            sortOrder: dto.sortOrder ?? 0,
        });

        await this.fieldRepository.save(field);
        return { message: 'api.product_attribute_field.created', field };
    }

    async update(id: string, dto: UpdateProductAttributeFieldDto) {
        const field = await this.fieldRepository.findOne({ where: { id } });

        if (!field) {
            throw new NotFoundException('api.product_attribute_field.not.found');
        }

        if (dto.name && dto.name.trim() !== field.name) {
            await this.assertUniqueName(dto.name.trim());
            field.name = dto.name.trim();
        }

        const nextType = dto.type ?? field.type;

        if (dto.type !== undefined) {
            field.type = dto.type;
        }

        if (dto.options !== undefined || dto.type !== undefined) {
            field.options = this.normalizeOptions(
                nextType,
                dto.options ?? field.options,
            );
        }

        if (dto.active !== undefined) {
            field.active = dto.active;
        }

        if (dto.sortOrder !== undefined) {
            field.sortOrder = dto.sortOrder;
        }

        await this.fieldRepository.save(field);
        return { message: 'api.product_attribute_field.updated', field };
    }

    async remove(id: string) {
        const field = await this.fieldRepository.findOne({ where: { id } });

        if (!field) {
            throw new NotFoundException('api.product_attribute_field.not.found');
        }

        await this.fieldRepository.remove(field);
        return { message: 'api.product_attribute_field.deleted', fieldId: id };
    }

    private async assertUniqueName(name: string) {
        const existing = await this.fieldRepository.findOne({
            where: { name: name.trim() },
        });

        if (existing) {
            throw new ConflictException('api.product_attribute_field.name.taken');
        }
    }

    private normalizeOptions(
        type: ProductAttributeFieldType,
        options?: string[],
    ): string[] {
        if (type !== ProductAttributeFieldType.Select) {
            return [];
        }

        const cleaned = (options ?? [])
            .map((option) => option.trim())
            .filter(Boolean);

        if (cleaned.length === 0) {
            throw new BadRequestException(
                'api.product_attribute_field.options.required',
            );
        }

        return cleaned;
    }
}
