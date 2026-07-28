import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Methods } from 'src/enums/Methods';
import { ADMIN_ROLES, SHOPKEEPER_ROLES } from 'src/enums/RoleGroups';
import { PaginationHelper } from 'src/helpers/utils';
import { RolesDecorator } from 'src/security/roles.decorator';
import { RolesGuard } from 'src/security/roles.guard';
import { CreateProductAttributeFieldDto } from './dto/create-product-attribute-field.dto';
import { UpdateProductAttributeFieldDto } from './dto/update-product-attribute-field.dto';
import { ProductAttributeFieldsService } from './product-attribute-fields.service';

@ApiTags('Product Attribute Fields Public Routes')
@Controller('/product-attribute-fields')
export class ProductAttributeFieldsControllerPublic {
    constructor(
        private readonly productAttributeFieldsService: ProductAttributeFieldsService,
    ) {}

    @Get('active')
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar campos de atributo ativos (público)' })
    findActive() {
        return this.productAttributeFieldsService.findActive();
    }
}

@ApiTags('Product Attribute Fields Protected Routes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('/auth/product-attribute-fields')
export class ProductAttributeFieldsController {
    constructor(
        private readonly productAttributeFieldsService: ProductAttributeFieldsService,
    ) {}

    @RolesDecorator(...ADMIN_ROLES)
    @Get('')
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar campos de atributo' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(@PaginationHelper() { page, limit }) {
        return this.productAttributeFieldsService.paginate({
            page,
            limit,
            route: '/auth/product-attribute-fields',
        });
    }

    @RolesDecorator(...ADMIN_ROLES, ...SHOPKEEPER_ROLES)
    @Get('active')
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar campos de atributo ativos' })
    findActive() {
        return this.productAttributeFieldsService.findActive();
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Get(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Buscar campo de atributo por ID' })
    @ApiParam({ name: 'id', type: String })
    findOne(@Param('id') id: string) {
        return this.productAttributeFieldsService.findOne(id);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Post(`${Methods.CREATE}`)
    @HttpCode(201)
    @ApiOperation({ summary: 'Criar campo de atributo' })
    create(@Body() dto: CreateProductAttributeFieldDto) {
        return this.productAttributeFieldsService.create(dto);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Patch(`${Methods.UPDATE}/:id`)
    @HttpCode(202)
    @ApiOperation({ summary: 'Atualizar campo de atributo' })
    @ApiParam({ name: 'id', type: String })
    update(
        @Param('id') id: string,
        @Body() dto: UpdateProductAttributeFieldDto,
    ) {
        return this.productAttributeFieldsService.update(id, dto);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Delete(`${Methods.DELETE}/:id`)
    @HttpCode(202)
    @ApiOperation({ summary: 'Excluir campo de atributo' })
    @ApiParam({ name: 'id', type: String })
    remove(@Param('id') id: string) {
        return this.productAttributeFieldsService.remove(id);
    }
}
