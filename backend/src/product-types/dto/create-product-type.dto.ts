import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductTypeDto {
    @ApiProperty({ example: 'Kit' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    isCustomizable?: boolean;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @IsBoolean()
    active?: boolean;
}
