import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Roles } from 'src/enums/Roles';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { ProductType } from 'src/product-types/entities/product-type.entity';
import { ProductAttributeField } from 'src/product-attribute-fields/entities/product-attribute-field.entity';
import { ProductAttributeFieldType } from 'src/enums/ProductAttributeFieldType';
import { Store } from 'src/store/entities/store.entity';
import { appConfig } from 'src/config/app.config';
import { DataSource, In } from 'typeorm';
import { FeatureFlagsService } from 'src/feature-flags/feature-flags.service';

const SYSTEM_ADMIN_ROLES = [Roles.Admin, Roles.Developer];

const PRODUCT_TYPES_SEED = [
    { name: 'Kit', isCustomizable: true },
    { name: 'Ímã', isCustomizable: false },
    { name: 'Acessório', isCustomizable: false },
];

const PRODUCT_ATTRIBUTE_FIELDS_SEED: Array<{
    name: string;
    type: ProductAttributeFieldType;
    options?: string[];
    sortOrder: number;
}> = [
    {
        name: 'Material',
        type: ProductAttributeFieldType.Text,
        sortOrder: 1,
    },
    {
        name: 'Cores',
        type: ProductAttributeFieldType.ColorList,
        sortOrder: 2,
    },
    {
        name: 'Resistente à água',
        type: ProductAttributeFieldType.Boolean,
        sortOrder: 3,
    },
    {
        name: 'Medida (cm)',
        type: ProductAttributeFieldType.Number,
        sortOrder: 4,
    },
    {
        name: 'Observação',
        type: ProductAttributeFieldType.Text,
        sortOrder: 5,
    },
    {
        name: 'Tamanho',
        type: ProductAttributeFieldType.Select,
        options: ['P', 'M', 'G', 'GG'],
        sortOrder: 6,
    },
];

@Injectable()
export class SeedingService implements OnModuleInit {
    private readonly logger = new Logger(SeedingService.name);

    constructor(
        private readonly dataSource: DataSource,
        private readonly featureFlags: FeatureFlagsService,
    ) {}

    async onModuleInit() {
        if (!this.featureFlags.isEnabled('seeding')) {
            this.logger.log('Seeding desabilitado (FEATURE_SEEDING=false)');
            return;
        }
        await this.createRoles();
        await this.createSystemAdmin();
        await this.createCanonicalStoreIfMissing();
        await this.createProductTypes();
        await this.createProductAttributeFields();
    }

    async createRoles() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const rolesRepository = queryRunner.manager.getRepository(Role);
            const rolesToSeed = Object.values(Roles);

            for (const role of rolesToSeed) {
                const existingRole = await rolesRepository.findOneBy({
                    name: role,
                });

                if (!existingRole) {
                    await rolesRepository.insert({ name: role });
                    this.logger.verbose(`Inserted role: ${role}`);
                } else {
                    this.logger.warn(`Role already exists: ${role}`);
                }
            }

            await queryRunner.commitTransaction();
            this.logger.log('Roles seeded successfully!');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to seed roles', (error as Error).stack);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createSystemAdmin() {
        const email = process.env.SYSTEM_ADMIN_EMAIL?.trim();
        const password = process.env.SYSTEM_ADMIN_PASSWORD;
        const name =
            process.env.SYSTEM_ADMIN_NAME?.trim() || 'Admin Memorinhas';

        if (!email || !password) {
            this.logger.warn(
                'System admin seed skipped: set SYSTEM_ADMIN_EMAIL and SYSTEM_ADMIN_PASSWORD',
            );
            return;
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const usersRepository = queryRunner.manager.getRepository(User);
            const rolesRepository = queryRunner.manager.getRepository(Role);

            const adminRoles = await rolesRepository.find({
                where: { name: In(SYSTEM_ADMIN_ROLES) },
            });

            if (adminRoles.length !== SYSTEM_ADMIN_ROLES.length) {
                throw new Error(
                    `Roles ${SYSTEM_ADMIN_ROLES.join(', ')} not found for system admin seed`,
                );
            }

            const existingUser = await usersRepository.findOne({
                where: { email },
                relations: ['roles'],
            });

            if (existingUser) {
                existingUser.roles = adminRoles;
                await usersRepository.save(existingUser);
                await queryRunner.commitTransaction();
                this.logger.warn(`System admin roles updated: ${email}`);
                return;
            }

            const admin = usersRepository.create({
                name,
                email,
                password,
                roles: adminRoles,
                settings: {},
            });

            await usersRepository.save(admin);
            await queryRunner.commitTransaction();
            this.logger.log(`System admin seeded: ${email}`);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error('Failed to seed system admin', (error as Error).stack);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createCanonicalStoreIfMissing() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const storeRepository = queryRunner.manager.getRepository(Store);
            const count = await storeRepository.count();

            if (count > 0) {
                await queryRunner.commitTransaction();
                this.logger.log(
                    `Canonical store already exists (${count}); skipping seed`,
                );
                return;
            }

            await storeRepository.insert({
                name: appConfig.storeName,
                brand_url: appConfig.storeBrandUrl,
                settings: {},
                sales: 0,
            });

            await queryRunner.commitTransaction();
            this.logger.log(
                `Canonical store seeded: ${appConfig.storeBrandUrl}`,
            );
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(
                'Failed to seed canonical store',
                (error as Error).stack,
            );
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createProductTypes() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const repository = queryRunner.manager.getRepository(ProductType);

            for (const seed of PRODUCT_TYPES_SEED) {
                const existing = await repository.findOneBy({ name: seed.name });

                if (!existing) {
                    await repository.insert({
                        name: seed.name,
                        isCustomizable: seed.isCustomizable,
                        active: true,
                    });
                    this.logger.verbose(`Inserted product type: ${seed.name}`);
                } else {
                    this.logger.warn(`Product type already exists: ${seed.name}`);
                }
            }

            await queryRunner.commitTransaction();
            this.logger.log('Product types seeded successfully!');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(
                'Failed to seed product types',
                (error as Error).stack,
            );
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    async createProductAttributeFields() {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const repository =
                queryRunner.manager.getRepository(ProductAttributeField);

            for (const seed of PRODUCT_ATTRIBUTE_FIELDS_SEED) {
                const existing = await repository.findOneBy({
                    name: seed.name,
                });

                if (!existing) {
                    await repository.insert({
                        name: seed.name,
                        type: seed.type,
                        options: seed.options ?? [],
                        active: true,
                        sortOrder: seed.sortOrder,
                    });
                    this.logger.verbose(
                        `Inserted product attribute field: ${seed.name}`,
                    );
                } else {
                    this.logger.warn(
                        `Product attribute field already exists: ${seed.name}`,
                    );
                }
            }

            await queryRunner.commitTransaction();
            this.logger.log('Product attribute fields seeded successfully!');
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(
                'Failed to seed product attribute fields',
                (error as Error).stack,
            );
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
