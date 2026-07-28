import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
    ValidateNested,
} from 'class-validator';
import { ProductAttributeFieldType } from 'src/enums/ProductAttributeFieldType';

export type ProductAttributeValue = string | number | boolean | string[];

export type ProductAttributeType =
    | ProductAttributeFieldType
    | 'legacy';

export class ProductAttributeDto {
    @ApiPropertyOptional({ example: 'uuid-do-campo' })
    @IsOptional()
    @IsUUID()
    fieldId?: string | null;

    @ApiPropertyOptional({
        enum: [...Object.values(ProductAttributeFieldType), 'legacy'],
        example: ProductAttributeFieldType.Text,
    })
    @IsOptional()
    @IsEnum({ ...ProductAttributeFieldType, legacy: 'legacy' })
    type?: ProductAttributeType;

    @ApiProperty({ example: 'Material' })
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiProperty({
        oneOf: [
            { type: 'string' },
            { type: 'number' },
            { type: 'boolean' },
            { type: 'array', items: { type: 'string' } },
        ],
        example: 'Acrílico',
    })
    @IsNotEmpty()
    value: ProductAttributeValue;
}

export class CreateProductDto {
    @ApiProperty({ example: 'Kit 5 Ímãs' })
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 49.9 })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    value: number;

    @ApiProperty({ example: 'uuid-do-tipo' })
    @IsUUID()
    productTypeId: string;

    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsNumber()
    @Min(1)
    customizableSlots?: number;

    @ApiPropertyOptional({
        type: [String],
        example: ['https://exemplo.com/img.jpg'],
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    product_imgs?: string[];

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    freight?: boolean;

    @ApiPropertyOptional({
        example: '<p>Ímãs personalizados com suas fotos.</p>',
    })
    @IsOptional()
    @IsString()
    description?: string | null;

    @ApiPropertyOptional({ type: [ProductAttributeDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ProductAttributeDto)
    attributes?: ProductAttributeDto[];
}
