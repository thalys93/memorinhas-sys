import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    Min,
    ValidateNested,
} from 'class-validator';

export class StoreContactSettingsDto {
    @ApiPropertyOptional({ example: '5551999999999' })
    @IsOptional()
    @Matches(/^\d{10,15}$/, { message: 'api.store.settings.whatsapp.invalid' })
    whatsapp?: string;

    @ApiPropertyOptional({ example: '@memorinhas' })
    @IsOptional()
    @IsString()
    instagram?: string;

    @ApiPropertyOptional({ example: ['Pix', 'Dinheiro', 'Cartão'] })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    paymentMethods?: string[];
}

export class StoreShippingSettingsDto {
    @ApiPropertyOptional({ example: '92' })
    @IsOptional()
    @IsString()
    localPrefix?: string;

    @ApiPropertyOptional({ example: 5 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    localRate?: number;

    @ApiPropertyOptional({ example: 15 })
    @IsOptional()
    @IsNumber()
    @Min(0)
    standardRate?: number;

    @ApiPropertyOptional({ example: 'Canoas, Porto Alegre, RS' })
    @IsOptional()
    @IsString()
    regions?: string;
}

export class StoreThemeSettingsDto {
    @ApiPropertyOptional({ example: '#b99778' })
    @IsOptional()
    @IsString()
    accentColor?: string;

    @ApiPropertyOptional({ example: 'https://exemplo.com/logo.png' })
    @IsOptional()
    @IsString()
    logoUrl?: string;

    @ApiPropertyOptional({ example: 'https://res.cloudinary.com/demo/image/upload/hero.jpg' })
    @IsOptional()
    @IsString()
    heroImageUrl?: string;
}

export class StoreProfileSettingsDto {
    @ApiPropertyOptional({
        example:
            'Eternizando memórias que merecem ser vistas todos os dias. Ímãs artesanais feitos com alma e carinho.',
    })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiPropertyOptional({ example: 'Canoas - RS, Brasil' })
    @IsOptional()
    @IsString()
    location?: string;
}

export class UpdateStoreSettingsDto {
    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => StoreContactSettingsDto)
    contact?: StoreContactSettingsDto;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => StoreShippingSettingsDto)
    shipping?: StoreShippingSettingsDto;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => StoreThemeSettingsDto)
    theme?: StoreThemeSettingsDto;

    @ApiPropertyOptional()
    @IsOptional()
    @ValidateNested()
    @Type(() => StoreProfileSettingsDto)
    profile?: StoreProfileSettingsDto;
}
