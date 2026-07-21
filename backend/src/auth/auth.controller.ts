import {
    Body,
    Controller,
    Get,
    HttpCode,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { loginDto } from './dto/login.dto';
import { User } from 'src/security/auth-user.decorator';
import { AuthUser } from './interfaces/auth-user.interface';
import { User as UserEntity } from 'src/user/entities/user.entity';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { VerifyResetDto } from './dto/verify-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@ApiTags('Auth Routes')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @HttpCode(200)
    @Post('login')
    @ApiOperation({
        summary: 'Autenticar usuário',
        description:
            'Realiza a autenticação do usuário com email e senha, retornando um token JWT para acesso às rotas protegidas.',
    })
    @ApiBody({
        type: loginDto,
        description: 'Credenciais de login do usuário',
    })
    @ApiResponse({
        status: 200,
        description: 'Login realizado com sucesso',
        schema: {
            type: 'object',
            properties: {
                access_token: {
                    type: 'string',
                    description: 'Token JWT para autenticação',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                },
                user: {
                    type: 'object',
                    description: 'Dados do usuário autenticado',
                    properties: {
                        id: { type: 'string', example: 'uuid-do-usuario' },
                        email: {
                            type: 'string',
                            example: 'usuario@exemplo.com',
                        },
                        name: { type: 'string', example: 'Nome do Usuário' },
                    },
                },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Credenciais inválidas',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: {
                    type: 'string',
                    example: 'Email ou senha incorretos',
                },
                error: { type: 'string', example: 'Unauthorized' },
            },
        },
    })
    @ApiResponse({
        status: 400,
        description: 'Dados de entrada inválidos',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 400 },
                message: {
                    type: 'array',
                    items: { type: 'string' },
                    example: [
                        'Email é obrigatório',
                        'Email deve ter um formato válido',
                    ],
                },
                error: { type: 'string', example: 'Bad Request' },
            },
        },
    })
    async login(@Body() loginData: loginDto, @User() user: UserEntity) {
        return await this.authService.login(user, loginData);
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({
        summary: 'Obter dados do usuário autenticado',
        description:
            'Retorna os dados do usuário autenticado com base no token JWT fornecido.',
    })
    @ApiResponse({
        status: 200,
        description: 'Dados do usuário autenticado',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'string', example: 'uuid-do-usuario' },
                email: { type: 'string', example: 'usuario@exemplo.com' },
                name: { type: 'string', example: 'Nome do Usuário' },
                role: { type: 'string', example: 'admin' },
                subscription_type: { type: 'string', example: 'free' },
                is_pro: { type: 'boolean', example: false },
                prompt_count: { type: 'number', example: 0 },
                max_prompts: { type: 'number', example: 1000 },
            },
        },
    })
    @ApiResponse({
        status: 401,
        description: 'Token inválido ou expirado',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 401 },
                message: {
                    type: 'string',
                    example: 'Token inválido ou expirado',
                },
                error: { type: 'string', example: 'Unauthorized' },
            },
        },
    })
    @ApiResponse({
        status: 403,
        description: 'Acesso negado',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 403 },
                message: { type: 'string', example: 'Acesso negado' },
                error: { type: 'string', example: 'Forbidden' },
            },
        },
    })
    @ApiResponse({
        status: 404,
        description: 'Usuário não encontrado',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 404 },
                message: { type: 'string', example: 'Usuário não encontrado' },
                error: { type: 'string', example: 'Not Found' },
            },
        },
    })
    @ApiResponse({
        status: 500,
        description: 'Erro interno do servidor',
        schema: {
            type: 'object',
            properties: {
                statusCode: { type: 'number', example: 500 },
                message: {
                    type: 'string',
                    example: 'Erro interno do servidor',
                },
                error: { type: 'string', example: 'Internal Server Error' },
            },
        },
    })
    async me(@User() user: AuthUser) {
        return await this.authService.me(user);
    }

    @Post('password/forgot')
    @HttpCode(200)
    async forgot(@Body() dto: ForgotPasswordDto) {
        return await this.authService.requestPasswordReset(dto.email);
    }

    @Post('password/verify')
    @HttpCode(200)
    async verify(@Body() dto: VerifyResetDto) {
        return await this.authService.verifyResetCode(dto.email, dto.code);
    }

    @Post('password/reset')
    @HttpCode(200)
    async reset(@Body() dto: ResetPasswordDto) {
        return await this.authService.resetPassword(dto.email, dto.password);
    }
}
