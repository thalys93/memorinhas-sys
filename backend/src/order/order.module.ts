import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { Product } from 'src/product/entities/product.entity';
import { StoreModule } from 'src/store/store.module';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import {
    OrderControllerProtected,
    OrderControllerPublic,
} from './order.controller';
import { OrderService } from './order.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Product]),
        StoreModule,
        MailModule,
    ],
    controllers: [OrderControllerPublic, OrderControllerProtected],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule {}
