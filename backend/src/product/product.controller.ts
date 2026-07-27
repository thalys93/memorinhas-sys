import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    HttpCode,
    Query,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiParam,
    ApiQuery,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Methods } from 'src/enums/Methods';
import { RolesGuard } from 'src/security/roles.guard';
import { User } from 'src/security/auth-user.decorator';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { PaginationHelper } from 'src/helpers/utils';

@ApiTags('Product Public Routes')
@Controller('/store')
export class ProductControllerPublic {
    constructor(private readonly productService: ProductService) {}

    @Get(':brand_url/products/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Buscar produto público por ID' })
    @ApiParam({ name: 'brand_url', example: 'memorinhas' })
    @ApiParam({ name: 'id', type: String })
    findOnePublic(
        @Param('brand_url') brandUrl: string,
        @Param('id') id: string,
    ) {
        return this.productService.findOnePublic(brandUrl, id);
    }

    @Get(':brand_url/products')
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar produtos públicos da loja' })
    @ApiParam({ name: 'brand_url', example: 'memorinhas' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'productTypeId', required: false, type: String })
    @ApiQuery({ name: 'minValue', required: false, type: Number })
    @ApiQuery({ name: 'maxValue', required: false, type: Number })
    @ApiQuery({ name: 'freight', required: false, type: Boolean })
    findPublic(
        @Param('brand_url') brandUrl: string,
        @PaginationHelper() { page, limit },
        @Query('search') search?: string,
        @Query('productTypeId') productTypeId?: string,
        @Query('minValue') minValue?: string,
        @Query('maxValue') maxValue?: string,
        @Query('freight') freight?: string,
    ) {
        return this.productService.paginatePublic(
            brandUrl,
            { page, limit, route: `/store/${brandUrl}/products` },
            {
                search,
                productTypeId,
                minValue: minValue !== undefined ? Number(minValue) : undefined,
                maxValue: maxValue !== undefined ? Number(maxValue) : undefined,
                freight:
                    freight === undefined
                        ? undefined
                        : freight === 'true' || freight === '1',
            },
        );
    }
}

@ApiTags('Product Protected Routes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('/auth/products')
export class ProductControllerProtected {
    constructor(private readonly productService: ProductService) {}

    @Get('')
    @HttpCode(200)
    @ApiOperation({ summary: 'Listar produtos' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'productTypeId', required: false, type: String })
    @ApiQuery({ name: 'minValue', required: false, type: Number })
    @ApiQuery({ name: 'maxValue', required: false, type: Number })
    @ApiQuery({ name: 'freight', required: false, type: Boolean })
    findAll(
        @User() authUser: AuthUser,
        @PaginationHelper() { page, limit },
        @Query('search') search?: string,
        @Query('productTypeId') productTypeId?: string,
        @Query('minValue') minValue?: string,
        @Query('maxValue') maxValue?: string,
        @Query('freight') freight?: string,
    ) {
        return this.productService.paginate(
            authUser,
            { page, limit, route: '/auth/products' },
            {
                search,
                productTypeId,
                minValue: minValue !== undefined ? Number(minValue) : undefined,
                maxValue: maxValue !== undefined ? Number(maxValue) : undefined,
                freight:
                    freight === undefined
                        ? undefined
                        : freight === 'true' || freight === '1',
            },
        );
    }

    @Get(':id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Buscar produto por ID' })
    @ApiParam({ name: 'id', type: String })
    findOne(@Param('id') id: string, @User() authUser: AuthUser) {
        return this.productService.findOne(id, authUser);
    }

    @Post(`${Methods.CREATE}`)
    @HttpCode(201)
    @ApiOperation({ summary: 'Criar produto' })
    create(
        @Body() createProductDto: CreateProductDto,
        @User() authUser: AuthUser,
    ) {
        return this.productService.create(createProductDto, authUser);
    }

    @Patch(`${Methods.UPDATE}/:id`)
    @HttpCode(202)
    @ApiOperation({ summary: 'Atualizar produto' })
    @ApiParam({ name: 'id', type: String })
    update(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @User() authUser: AuthUser,
    ) {
        return this.productService.update(id, updateProductDto, authUser);
    }

    @Delete(`${Methods.DELETE}/:id`)
    @HttpCode(202)
    @ApiOperation({ summary: 'Remover produto' })
    @ApiParam({ name: 'id', type: String })
    remove(@Param('id') id: string, @User() authUser: AuthUser) {
        return this.productService.remove(id, authUser);
    }
}
