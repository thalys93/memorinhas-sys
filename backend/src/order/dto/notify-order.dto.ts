import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class NotifyOrderDto {
    @ApiPropertyOptional({ example: 'Seu pedido foi atualizado.' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    message?: string;
}
