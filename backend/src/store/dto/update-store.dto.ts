import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsInt,
    IsOptional,
    IsString,
    Matches,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { UpdateStoreSettingsDto } from './store-settings.dto';

export class UpdateStoreDto {
    @ApiPropertyOptional({ example: 'Memorinhas' })
    @IsOptional()
    @IsString()
    @MinLength(1)
    name?: string;

    @ApiPropertyOptional({ example: 'memorinhas' })
    @IsOptional()
    @IsString()
    @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: 'api.store.brand_url.invalid',
    })
    brand_url?: string;

    @ApiPropertyOptional({ example: 0 })
    @IsOptional()
    @IsInt()
    @Min(0)
    sales?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateStoreSettingsDto)
    settings?: UpdateStoreSettingsDto;
}
