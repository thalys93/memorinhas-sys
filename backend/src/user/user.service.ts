/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Role } from 'src/roles/entities/role.entity';
import { Roles } from 'src/enums/Roles';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { generatePass } from 'src/helpers/generateToken';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
    private logger = new Logger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(Role)
        private readonly rolesRepository: Repository<Role>,

        private readonly emailService: MailService,
    ) {}

    async paginate(options: IPaginationOptions) {
        const queryBuilder = this.usersRepository.createQueryBuilder('user');
        queryBuilder.leftJoinAndSelect('user.roles', 'roles');
        queryBuilder.orderBy('user.name', 'ASC');
        return paginate<User>(queryBuilder, options);
    }

    async resolveRoles(roleNames?: string[]): Promise<Role[]> {
        const names =
            roleNames?.length ? roleNames : [Roles.User];

        const roles = await this.rolesRepository.find({
            where: { name: In(names) },
        });

        if (roles.length !== names.length) {
            const found = new Set(roles.map((r) => r.name));
            const missing = names.filter((n) => !found.has(n as Roles));
            throw new NotFoundException(`api.role.not.found: ${missing.join(', ')}`);
        }

        return roles;
    }

    async create(createUserDto: CreateUserDto) {
        const roles = await this.resolveRoles(createUserDto.roles);
        const plainPassword = createUserDto.password ?? generatePass();

        const user = this.usersRepository.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: plainPassword,
            recoverToken: createUserDto.recoverToken,
            avatar_url: createUserDto.avatar_url,
            roles,
            settings: createUserDto.settings ?? {},
        });

        await this.usersRepository.save(user);
        await this.emailService.sendWelcomeMail(user.email, plainPassword);

        delete user.password;
        return { message: 'api.user.created', user };
    }

    async findByIdWithRoles(id: string): Promise<User | null> {
        return await this.usersRepository.findOne({
            where: { id },
            relations: ['roles'],
        });
    }

    async findAll() {
        const allUsers = await this.usersRepository.find({
            relations: ['roles'],
            select: ['id', 'name', 'email', 'avatar_url'],
        });

        if (allUsers.length === 0) {
            throw new NotFoundException('api.users.not.found');
        }

        return { found: allUsers };
    }

    async findOne(id: string) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['roles'],
        });
        if (!user) {
            throw new NotFoundException('api.user.not.found');
        }

        delete user.password;
        return { found: user };
    }

    async findByEmail(email: string) {
        try {
            return await this.usersRepository.findOneOrFail({
                where: { email },
                relations: ['roles'],
            });
        } catch (e) {
            this.logger.error(e);
            throw new NotFoundException('api.user.email.not_found');
        }
    }

    async update(
        id: string,
        updateUserDto: UpdateUserDto,
        authUser?: AuthUser,
        isAdmin = false,
    ) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['roles'],
        });
        if (!user) {
            throw new NotFoundException('api.user.not.found');
        }

        const isSelf = authUser?.id === id;
        const allowedFields = ['name', 'email', 'avatar_url', 'settings'];
        const filteredUpdateData: Record<string, unknown> = {};

        for (const field of allowedFields) {
            if (updateUserDto[field] !== undefined) {
                filteredUpdateData[field] = updateUserDto[field];
            }
        }

        Object.assign(user, filteredUpdateData);

        if (isAdmin && !isSelf && updateUserDto.roles?.length) {
            user.roles = await this.resolveRoles(updateUserDto.roles);
        }

        await this.usersRepository.save(user);
        delete user.password;
        return { message: 'api.user.updated', user };
    }

    async updateToken(id: string, token: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('api.user.not.found');
        }

        user.recoverToken = token;
        await this.usersRepository.update(id, user);
        return { message: 'api.user.token.updated', user };
    }

    async remove(id: string) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('api.user.not.found');
        }

        await this.usersRepository.delete(id);
        return { message: 'api.user.deleted', userID: id };
    }

    async updatePasswordByEmail(email: string, newPassword: string) {
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('api.user.email.not_found');
        }
        const { hashSync } = await import('bcrypt');
        const hashed = hashSync(newPassword, 10);

        await this.usersRepository.update(user.id, {
            password: hashed,
            recoverToken: null,
        });

        return { message: 'api.user.password.updated', userId: user.id };
    }
}
