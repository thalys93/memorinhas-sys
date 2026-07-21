import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import {
    ADMIN_ROLES,
    STORE_KEEPER_ELIGIBLE_ROLES,
} from 'src/enums/RoleGroups';
import { resolveUserRoles, hasAnyRole } from 'src/helpers/utils';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/user/entities/user.entity';
import { Store } from './entities/store.entity';
import { UpdateStoreDto } from './dto/update-store.dto';
import { AssignKeepersDto } from './dto/assign-keepers.dto';
import {
    DEFAULT_PAYMENT_METHODS,
    StorePublicSettings,
    StoreSettings,
} from './interfaces/store-settings.interface';
import { UpdateStoreSettingsDto } from './dto/store-settings.dto';


@Injectable()
export class StoreService {
    private readonly logger = new Logger(StoreService.name);

    constructor(
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailService: MailService,
    ) {}

    async getCanonicalStore(relations: string[] = []): Promise<Store> {
        const count = await this.storeRepository.count();
        if (count > 1) {
            this.logger.warn(
                `Found ${count} stores; using oldest as canonical (single-tenant).`,
            );
        }

        const store = await this.storeRepository.findOne({
            where: {},
            order: { createdAt: 'ASC' },
            relations,
        });

        if (!store) {
            throw new NotFoundException('api.store.not.found');
        }

        return store;
    }

    async findOne(authUser: AuthUser) {
        const store = await this.assertStoreAccess(authUser);
        return { found: this.sanitizeStore(store) };
    }

    async findByBrandUrl(brandUrl: string) {
        const store = await this.storeRepository.findOne({
            where: { brand_url: brandUrl },
            relations: ['products', 'products.productType'],
        });

        if (!store) {
            throw new NotFoundException('api.store.not.found');
        }

        const { keepers: _keepers, ...publicStore } = store;
        return {
            found: {
                ...publicStore,
                settings: this.toPublicSettings(store.settings),
            },
        };
    }

    async update(updateStoreDto: UpdateStoreDto, authUser: AuthUser) {
        const store = await this.assertStoreAccess(authUser);

        if (updateStoreDto.brand_url) {
            const existing = await this.storeRepository.findOne({
                where: { brand_url: updateStoreDto.brand_url },
            });

            if (existing && existing.id !== store.id) {
                throw new ConflictException('api.store.brand_url.taken');
            }
        }

        const { settings, ...scalarUpdates } = updateStoreDto;

        if (settings) {
            store.settings = this.mergeSettings(store.settings ?? {}, settings);
        }

        Object.assign(store, scalarUpdates);
        await this.storeRepository.save(store);
        return { message: 'api.store.updated', store: this.sanitizeStore(store) };
    }

    async assignKeepers(assignKeepersDto: AssignKeepersDto) {
        const store = await this.getCanonicalStore(['keepers']);

        const users = await this.userRepository.find({
            where: { id: In(assignKeepersDto.keeperIds) },
            relations: ['roles'],
        });

        if (users.length !== assignKeepersDto.keeperIds.length) {
            throw new NotFoundException('api.user.not.found');
        }

        for (const user of users) {
            this.assertKeeperEligible(user);
        }

        const existingIds = new Set(store.keepers.map((keeper) => keeper.id));
        const newKeepers = users.filter((user) => !existingIds.has(user.id));
        store.keepers = [...store.keepers, ...newKeepers];
        await this.storeRepository.save(store);

        for (const keeper of newKeepers) {
            if (!keeper.email) continue;
            try {
                await this.mailService.sendNotificationMail(
                    keeper.email,
                    `Você foi atribuído(a) à loja ${store.name}`,
                    `Olá${keeper.name ? ` ${keeper.name}` : ''}, você foi atribuído(a) como lojista da loja ${store.name}.`,
                );
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                this.logger.error(
                    `Falha ao notificar keeper ${keeper.email}: ${msg}`,
                );
            }
        }

        return {
            message: 'api.store.keepers.assigned',
            store: this.sanitizeStore(store),
        };
    }

    async removeKeeper(userId: string) {
        const store = await this.getCanonicalStore(['keepers']);

        store.keepers = store.keepers.filter((keeper) => keeper.id !== userId);
        await this.storeRepository.save(store);
        return {
            message: 'api.store.keeper.removed',
            store: this.sanitizeStore(store),
        };
    }

    async assertStoreAccess(authUser: AuthUser): Promise<Store> {
        const store = await this.getCanonicalStore(['keepers', 'products']);

        if (hasAnyRole(resolveUserRoles(authUser.roles), ADMIN_ROLES)) {
            return store;
        }

        const isKeeper = store.keepers.some(
            (keeper) => keeper.id === authUser.id,
        );

        if (!isKeeper) {
            throw new ForbiddenException('api.role.forbidden');
        }

        return store;
    }

    assertKeeperEligible(user: User) {
        const userRoles = resolveUserRoles(user.roles);
        const eligible = userRoles.some((r) =>
            STORE_KEEPER_ELIGIBLE_ROLES.includes(r),
        );

        if (!eligible) {
            throw new BadRequestException('api.store.keeper.ineligible');
        }
    }

    private sanitizeStore(store: Store): Store {
        if (store.keepers?.length) {
            for (const keeper of store.keepers) {
                delete keeper.password;
                delete keeper.recoverToken;
            }
        }
        store.settings = {
            ...store.settings,
            contact: this.withDefaultPaymentMethods(store.settings?.contact),
        };
        return store;
    }

    private mergeSettings(
        current: StoreSettings,
        patch: UpdateStoreSettingsDto,
    ): StoreSettings {
        return {
            ...current,
            contact: patch.contact
                ? { ...current.contact, ...patch.contact }
                : current.contact,
            shipping: patch.shipping
                ? { ...current.shipping, ...patch.shipping }
                : current.shipping,
            theme: patch.theme
                ? { ...current.theme, ...patch.theme }
                : current.theme,
            profile: patch.profile
                ? { ...current.profile, ...patch.profile }
                : current.profile,
        };
    }

    private toPublicSettings(settings: StoreSettings = {}): StorePublicSettings {
        const { contact, shipping, theme, profile } = settings;
        return {
            contact: this.withDefaultPaymentMethods(contact),
            shipping,
            theme,
            profile,
        };
    }

    private withDefaultPaymentMethods(
        contact?: StoreSettings['contact'],
    ): StoreSettings['contact'] {
        const methods = contact?.paymentMethods?.filter((m) => m?.trim());
        return {
            ...contact,
            paymentMethods:
                methods?.length ? methods : [...DEFAULT_PAYMENT_METHODS],
        };
    }
}
