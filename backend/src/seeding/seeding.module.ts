import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedingService } from './seeding.service';
import { SeedingControllerProtected } from './seeding.controller';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { ProductType } from 'src/product-types/entities/product-type.entity';
import { Store } from 'src/store/entities/store.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Role, User, ProductType, Store])],
    controllers: [SeedingControllerProtected],
    providers: [SeedingService],
})
export class SeedingModule {}
