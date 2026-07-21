import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, ValidateIf } from 'class-validator';
import { FulfillmentMode } from 'src/enums/FulfillmentMode';
import { OrderStatus } from 'src/enums/OrderStatus';

export class UpdateOrderStatusDto {
    @ApiProperty({ enum: OrderStatus })
    @IsEnum(OrderStatus)
    status: OrderStatus;

    @ApiPropertyOptional({ enum: FulfillmentMode })
    @ValidateIf((dto: UpdateOrderStatusDto) => dto.status === OrderStatus.Shipped)
    @IsEnum(FulfillmentMode)
    fulfillmentMode?: FulfillmentMode;
}
