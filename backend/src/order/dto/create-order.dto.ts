import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    ArrayMinSize,
    IsArray,
    IsEmail,
    IsInt,
    IsOptional,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    Min,
    ValidateNested,
} from 'class-validator';

export class CreateOrderItemCustomizationDto {
    @ApiPropertyOptional({ type: [String] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    imageUrls?: string[];
}

export class CreateOrderItemDto {
    @ApiProperty()
    @IsUUID()
    productId: string;

    @ApiProperty({ example: 1 })
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiPropertyOptional({ type: CreateOrderItemCustomizationDto })
    @IsOptional()
    @ValidateNested()
    @Type(() => CreateOrderItemCustomizationDto)
    customization?: CreateOrderItemCustomizationDto;
}

export class CreateOrderDto {
    @ApiProperty({ example: 'Maria Silva' })
    @IsString()
    @MaxLength(120)
    customerName: string;

    @ApiProperty({ example: '51999999999' })
    @IsString()
    @Matches(/^\d{10,15}$/, { message: 'api.order.phone.invalid' })
    customerPhone: string;

    @ApiProperty({ example: 'maria@email.com' })
    @IsEmail({}, { message: 'api.order.email.invalid' })
    @MaxLength(160)
    customerEmail: string;

    @ApiProperty({ example: '92000000' })
    @IsString()
    @Matches(/^\d{8}$/, { message: 'api.order.cep.invalid' })
    cep: string;

    @ApiProperty({ example: 'Pix' })
    @IsString()
    @MaxLength(60)
    paymentMethod: string;

    @ApiProperty({ type: [CreateOrderItemDto] })
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => CreateOrderItemDto)
    items: CreateOrderItemDto[];
}
