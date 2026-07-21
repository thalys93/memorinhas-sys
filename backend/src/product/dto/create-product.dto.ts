import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    Min,
} from 'class-validator';

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
}
