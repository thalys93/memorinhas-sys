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
import { ProductTypesService } from './product-types.service';
import { CreateProductTypeDto } from './dto/create-product-type.dto';
import { UpdateProductTypeDto } from './dto/update-product-type.dto';
import { Methods } from 'src/enums/Methods';
import { RolesGuard } from 'src/security/roles.guard';
import { RolesDecorator } from 'src/security/roles.decorator';
import { ADMIN_ROLES, SHOPKEEPER_ROLES } from 'src/enums/RoleGroups';
import { PaginationHelper } from 'src/helpers/utils';

@ApiTags('Product Types Public Routes')
@Controller('/product-types')
export class ProductTypesControllerPublic {
    constructor(private readonly productTypesService: ProductTypesService) {}

    @Get('active')
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar tipos de produto ativos (público)' })
    findActive() {
        return this.productTypesService.findActive();
    }
}

@ApiTags('Product Types Protected Routes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('/auth/product-types')
export class ProductTypesController {
    constructor(private readonly productTypesService: ProductTypesService) {}

    @RolesDecorator(...ADMIN_ROLES)
    @Get('')
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar tipos de produto' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(@PaginationHelper() { page, limit }) {
        return this.productTypesService.paginate({
            page,
            limit,
            route: '/auth/product-types',
        });
    }

    @RolesDecorator(...ADMIN_ROLES, ...SHOPKEEPER_ROLES)
    @Get('active')
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar tipos de produto ativos' })
    findActive() {
        return this.productTypesService.findActive();
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Get(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Buscar tipo de produto por ID' })
    @ApiParam({ name: 'id', type: String })
    findOne(@Param('id') id: string) {
        return this.productTypesService.findOne(id);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Post(`${Methods.CREATE}`)
    @HttpCode(201)
    @ApiOperation({ summary: 'Criar tipo de produto' })
    create(@Body() dto: CreateProductTypeDto) {
        return this.productTypesService.create(dto);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Patch(`${Methods.UPDATE}/:id`)
    @HttpCode(202)
    @ApiOperation({ summary: 'Atualizar tipo de produto' })
    @ApiParam({ name: 'id', type: String })
    update(@Param('id') id: string, @Body() dto: UpdateProductTypeDto) {
        return this.productTypesService.update(id, dto);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Delete(`${Methods.DELETE}/:id`)
    @HttpCode(202)
    @ApiOperation({ summary: 'Desativar tipo de produto (soft-delete)' })
    @ApiParam({ name: 'id', type: String })
    remove(@Param('id') id: string) {
        return this.productTypesService.softDelete(id);
    }
}
