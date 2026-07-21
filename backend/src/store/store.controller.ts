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
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiBearerAuth,
    ApiParam,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { StoreService } from './store.service';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AssignKeepersDto } from './dto/assign-keepers.dto';
import { RolesGuard } from 'src/security/roles.guard';
import { RolesDecorator } from 'src/security/roles.decorator';
import { User } from 'src/security/auth-user.decorator';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { ADMIN_ROLES } from 'src/enums/RoleGroups';

@ApiTags('Store Public Routes')
@Controller('/store')
export class StoreControllerPublic {
    constructor(private readonly storeService: StoreService) {}

    @Get(':brand_url')
    @HttpCode(200)
    @ApiOperation({ summary: 'Buscar loja pública por brand_url' })
    @ApiParam({ name: 'brand_url', example: 'memorinhas' })
    findByBrandUrl(@Param('brand_url') brandUrl: string) {
        return this.storeService.findByBrandUrl(brandUrl);
    }
}

@ApiTags('Store Protected Routes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('/auth/store')
export class StoreControllerProtected {
    constructor(private readonly storeService: StoreService) {}

    @Get('')
    @HttpCode(200)
    @ApiOperation({ summary: 'Buscar loja canônica' })
    findOne(@User() authUser: AuthUser) {
        return this.storeService.findOne(authUser);
    }

    @Patch('')
    @HttpCode(202)
    @ApiOperation({ summary: 'Atualizar loja canônica' })
    update(
        @Body() updateStoreDto: UpdateStoreDto,
        @User() authUser: AuthUser,
    ) {
        return this.storeService.update(updateStoreDto, authUser);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Post('keepers')
    @HttpCode(201)
    @ApiOperation({ summary: 'Vincular keepers à loja' })
    assignKeepers(@Body() assignKeepersDto: AssignKeepersDto) {
        return this.storeService.assignKeepers(assignKeepersDto);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Delete('keepers/:userId')
    @HttpCode(202)
    @ApiOperation({ summary: 'Desvincular keeper da loja' })
    @ApiParam({ name: 'userId', type: String })
    removeKeeper(@Param('userId') userId: string) {
        return this.storeService.removeKeeper(userId);
    }
}
