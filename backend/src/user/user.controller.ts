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
    ForbiddenException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiBody,
} from '@nestjs/swagger';
import { Methods } from 'src/enums/Methods';
import { RolesGuard } from 'src/security/roles.guard';
import { RolesDecorator } from 'src/security/roles.decorator';
import { User } from 'src/security/auth-user.decorator';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { PaginationHelper, hasAnyRole, resolveUserRoles } from 'src/helpers/utils';
import { ADMIN_ROLES } from 'src/enums/RoleGroups';

@ApiTags('User Protected Routes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('/auth/users')
export class UserControllerProtected {
    constructor(private readonly usersService: UserService) {}

    @RolesDecorator(...ADMIN_ROLES)
    @Post('')
    @HttpCode(201)
    @ApiOperation({ summary: 'Criar usuário (Admin)' })
    @ApiBody({ type: CreateUserDto })
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Get('')
    @HttpCode(200)
    @ApiOperation({
        summary: 'Listar usuários',
        description:
            'Retorna uma lista paginada de todos os usuários do sistema. Apenas usuários com permissões de infraestrutura podem executar esta ação.',
    })
    @ApiQuery({
        name: 'page',
        description: 'Número da página para paginação',
        type: Number,
        example: 1,
        required: false,
    })
    @ApiQuery({
        name: 'limit',
        description: 'Limite de itens por página',
        type: Number,
        example: 10,
        required: false,
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de usuários retornada com sucesso',
    })
    @ApiResponse({
        status: 401,
        description: 'Token de autenticação inválido ou ausente',
    })
    @ApiResponse({
        status: 403,
        description: 'Usuário não possui permissão para executar esta ação',
    })
    findAll(@PaginationHelper() { page, limit }) {
        return this.usersService.paginate({
            page,
            limit,
            route: '/auth/user',
        });
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Get(`:id`)
    @HttpCode(200)
    @ApiOperation({
        summary: 'Buscar usuário por ID',
        description:
            'Retorna os detalhes de um usuário específico pelo seu ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID do usuário a ser buscado',
        type: 'string',
        example: 'uuid-do-usuario',
    })
    @ApiResponse({
        status: 200,
        description: 'Usuário encontrado com sucesso',
    })
    @ApiResponse({
        status: 401,
        description: 'Token de autenticação inválido ou ausente',
    })
    @ApiResponse({
        status: 403,
        description: 'Usuário não possui permissão para executar esta ação',
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado',
    })
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Patch(`${Methods.UPDATE}/me`)
    @HttpCode(202)
    @ApiOperation({
        summary: 'Atualizar próprios dados',
        description:
            'Permite que o usuário autenticado atualize seus próprios dados.',
    })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: 202,
        description: 'Dados atualizados com sucesso',
    })
    @ApiResponse({
        status: 401,
        description: 'Token de autenticação inválido ou ausente',
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado',
    })
    updateMe(@User() authUser: AuthUser, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(authUser.id, updateUserDto, authUser, false);
    }

    @RolesDecorator(...ADMIN_ROLES)
    @Patch(`${Methods.UPDATE}/:id`)
    @HttpCode(202)
    @ApiOperation({
        summary: 'Atualizar usuário (Admin)',
        description:
            'Atualiza os dados de um usuário existente. Apenas usuários com permissões de infraestrutura podem executar esta ação.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID do usuário a ser atualizado',
        type: 'string',
        example: 'uuid-do-usuario',
    })
    @ApiBody({ type: UpdateUserDto })
    @ApiResponse({
        status: 202,
        description: 'Usuário atualizado com sucesso',
    })
    @ApiResponse({
        status: 401,
        description: 'Token de autenticação inválido ou ausente',
    })
    @ApiResponse({
        status: 403,
        description: 'Usuário não possui permissão para executar esta ação',
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado',
    })
    @ApiResponse({
        status: 400,
        description: 'Dados de entrada inválidos',
    })
    update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @User() authUser: AuthUser,
    ) {
        return this.usersService.update(id, updateUserDto, authUser, true);
    }

    @Delete(`${Methods.DELETE}/:id`)
    @HttpCode(202)
    @ApiOperation({
        summary: 'Remover usuário',
        description:
            'Remove um usuário do sistema. Apenas usuários com permissões de infraestrutura podem executar esta ação.',
    })
    @ApiParam({
        name: 'id',
        description: 'ID do usuário a ser removido',
        type: 'string',
        example: 'uuid-do-usuario',
    })
    @ApiResponse({
        status: 202,
        description: 'Usuário removido com sucesso',
    })
    @ApiResponse({
        status: 401,
        description: 'Token de autenticação inválido ou ausente',
    })
    @ApiResponse({
        status: 403,
        description: 'Usuário não possui permissão para executar esta ação',
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado',
    })
    remove(@Param('id') id: string, @User() authUser: AuthUser) {
        const isSelf = id === authUser.id;
        const isAdmin = hasAnyRole(resolveUserRoles(authUser.roles), ADMIN_ROLES);
        if (!isSelf && !isAdmin) {
            throw new ForbiddenException(
                'Usuário não possui permissão para executar esta ação',
            );
        }
        return this.usersService.remove(id);
    }
}
