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
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { Methods } from 'src/enums/Methods';
import { ADMIN_ROLES, SHOPKEEPER_ROLES } from 'src/enums/RoleGroups';
import { PaginationHelper } from 'src/helpers/utils';
import { User } from 'src/security/auth-user.decorator';
import { RolesDecorator } from 'src/security/roles.decorator';
import { RolesGuard } from 'src/security/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotifyOrderDto } from './dto/notify-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

@ApiTags('Order Public Routes')
@Controller('/store')
export class OrderControllerPublic {
    constructor(private readonly orderService: OrderService) {}

    @Post(':brand_url/orders')
    @HttpCode(201)
    @ApiOperation({ summary: 'Criar pedido público' })
    @ApiParam({ name: 'brand_url', example: 'memorinhas' })
    create(
        @Param('brand_url') brandUrl: string,
        @Body() dto: CreateOrderDto,
    ) {
        return this.orderService.createPublic(brandUrl, dto);
    }
}

@ApiTags('Order Protected Routes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('/auth/orders')
export class OrderControllerProtected {
    constructor(private readonly orderService: OrderService) {}

    @Get('summary')
    @HttpCode(200)
    @RolesDecorator(...ADMIN_ROLES, ...SHOPKEEPER_ROLES)
    @ApiOperation({ summary: 'Resumo de pedidos da loja' })
    summary(@User() authUser: AuthUser) {
        return this.orderService.summary(authUser);
    }

    @Get('')
    @HttpCode(200)
    @RolesDecorator(...ADMIN_ROLES, ...SHOPKEEPER_ROLES)
    @ApiOperation({ summary: 'Listar pedidos da loja' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(
        @User() authUser: AuthUser,
        @PaginationHelper() { page, limit },
    ) {
        return this.orderService.paginate(authUser, {
            page,
            limit,
            route: '/auth/orders',
        });
    }

    @Get(':id')
    @HttpCode(200)
    @RolesDecorator(...ADMIN_ROLES, ...SHOPKEEPER_ROLES)
    @ApiOperation({ summary: 'Buscar pedido por ID' })
    @ApiParam({ name: 'id', type: String })
    findOne(@Param('id') id: string, @User() authUser: AuthUser) {
        return this.orderService.findOne(id, authUser);
    }

    @Patch(`${Methods.UPDATE}/:id`)
    @HttpCode(202)
    @RolesDecorator(...ADMIN_ROLES, ...SHOPKEEPER_ROLES)
    @ApiOperation({ summary: 'Atualizar status do pedido' })
    @ApiParam({ name: 'id', type: String })
    updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateOrderStatusDto,
        @User() authUser: AuthUser,
    ) {
        return this.orderService.updateStatus(id, dto, authUser);
    }

    @Post(':id/notify-email')
    @HttpCode(200)
    @RolesDecorator(...ADMIN_ROLES, ...SHOPKEEPER_ROLES)
    @ApiOperation({ summary: 'Enviar e-mail ao cliente do pedido' })
    @ApiParam({ name: 'id', type: String })
    notifyEmail(
        @Param('id') id: string,
        @Body() dto: NotifyOrderDto,
        @User() authUser: AuthUser,
    ) {
        return this.orderService.notifyCustomer(id, dto, authUser);
    }

    @Delete(`${Methods.DELETE}/:id`)
    @HttpCode(200)
    @RolesDecorator(...ADMIN_ROLES, ...SHOPKEEPER_ROLES)
    @ApiOperation({ summary: 'Excluir pedido' })
    @ApiParam({ name: 'id', type: String })
    remove(@Param('id') id: string, @User() authUser: AuthUser) {
        return this.orderService.remove(id, authUser);
    }
}
