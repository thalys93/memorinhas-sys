import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import {
    StoreControllerProtected,
    StoreControllerPublic,
} from './store.controller';
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Store, User]), MailModule],
    controllers: [StoreControllerProtected, StoreControllerPublic],
    providers: [StoreService],
    exports: [StoreService],
})
export class StoreModule {}
