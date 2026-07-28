import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { ProductAttributeFieldType } from 'src/enums/ProductAttributeFieldType';

export class CreateProductAttributeFieldDto {
    @ApiProperty({ example: 'Material' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ enum: ProductAttributeFieldType, example: ProductAttributeFieldType.Text })
    @IsEnum(ProductAttributeFieldType)
    type: ProductAttributeFieldType;

    @ApiPropertyOptional({ type: [String], example: ['P', 'M', 'G'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    options?: string[];

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    sortOrder?: number;
}
