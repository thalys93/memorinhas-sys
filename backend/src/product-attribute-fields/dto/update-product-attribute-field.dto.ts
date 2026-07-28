import { PartialType } from '@nestjs/swagger';
import { CreateProductAttributeFieldDto } from './create-product-attribute-field.dto';

export class UpdateProductAttributeFieldDto extends PartialType(
    CreateProductAttributeFieldDto,
) {}
