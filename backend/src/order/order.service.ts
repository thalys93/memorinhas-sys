import {
    BadRequestException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { In, Repository } from 'typeorm';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';
import { FulfillmentMode } from 'src/enums/FulfillmentMode';
import { OrderStatus } from 'src/enums/OrderStatus';
import { MailService, OrderMailPayload } from 'src/mail/mail.service';
import { Product } from 'src/product/entities/product.entity';
import { StoreService } from 'src/store/store.service';
import { DEFAULT_PAYMENT_METHODS } from 'src/store/interfaces/store-settings.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotifyOrderDto } from './dto/notify-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { computeFreight } from './freight';

@Injectable()
export class OrderService {
    private readonly logger = new Logger(OrderService.name);

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        private readonly storeService: StoreService,
        private readonly mailService: MailService,
    ) {}

    async createPublic(brandUrl: string, dto: CreateOrderDto) {
        const { found: store } =
            await this.storeService.findByBrandUrl(brandUrl);

        const paymentMethods =
            store.settings?.contact?.paymentMethods?.length
                ? store.settings.contact.paymentMethods
                : DEFAULT_PAYMENT_METHODS;

        if (!paymentMethods.includes(dto.paymentMethod)) {
            throw new BadRequestException('api.order.payment.invalid');
        }

        const productIds = dto.items.map((item) => item.productId);
        const products = await this.productRepository.find({
            where: { id: In(productIds) },
            relations: ['store'],
        });

        if (products.length !== new Set(productIds).size) {
            throw new NotFoundException('api.product.not.found');
        }

        for (const product of products) {
            if (product.store.id !== store.id) {
                throw new BadRequestException('api.order.product.store.mismatch');
            }
        }

        const productById = new Map(products.map((p) => [p.id, p]));
        let subtotal = 0;
        let allFree = true;

        const orderItems = dto.items.map((item) => {
            const product = productById.get(item.productId)!;
            const unitValue = Number(product.value);
            subtotal += unitValue * item.quantity;
            if (!product.freight) allFree = false;

            return this.orderItemRepository.create({
                product,
                quantity: item.quantity,
                unitValue,
                freight: product.freight,
                customization: item.customization?.imageUrls?.length
                    ? { imageUrls: item.customization.imageUrls }
                    : null,
            });
        });

        const shipping = store.settings?.shipping;
        const freight = computeFreight({
            allItemsFreeFreight: allFree,
            cep: dto.cep,
            localPrefix: shipping?.localPrefix,
            localRate: shipping?.localRate,
            standardRate: shipping?.standardRate,
        });

        const order = this.orderRepository.create({
            store: { id: store.id },
            status: OrderStatus.Pending,
            customerName: dto.customerName.trim(),
            customerPhone: dto.customerPhone,
            customerEmail: dto.customerEmail.trim().toLowerCase(),
            cep: dto.cep,
            paymentMethod: dto.paymentMethod,
            freightAmount: freight.amount,
            freightType: freight.type,
            subtotal,
            total: subtotal + freight.amount,
            items: orderItems,
        });

        const saved = await this.orderRepository.save(order);
        const full = await this.findOneEntity(saved.id);

        await this.safeSendMail(async () => {
            if (!full.customerEmail) return;
            await this.mailService.sendOrderCreatedMail(
                this.toMailPayload(full, store.name),
            );
        });

        return full;
    }

    async paginate(authUser: AuthUser, options: IPaginationOptions) {
        const store = await this.storeService.assertStoreAccess(authUser);

        const queryBuilder = this.orderRepository
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'items')
            .leftJoinAndSelect('items.product', 'product')
            .leftJoin('order.store', 'store')
            .andWhere('store.id = :storeId', { storeId: store.id })
            .orderBy('order.createdAt', 'DESC');

        return paginate<Order>(queryBuilder, options);
    }

    async findOne(id: string, authUser: AuthUser) {
        const store = await this.storeService.assertStoreAccess(authUser);
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['store', 'items', 'items.product'],
        });

        if (!order || order.store.id !== store.id) {
            throw new NotFoundException('api.order.not.found');
        }

        return { found: order };
    }

    async summary(authUser: AuthUser) {
        const store = await this.storeService.assertStoreAccess(authUser);

        const rows: { status: OrderStatus; count: string; revenue: string }[] =
            await this.orderRepository
                .createQueryBuilder('order')
                .leftJoin('order.store', 'store')
                .select('order.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .addSelect(
                    `SUM(CASE WHEN order.status = :completed THEN order.total ELSE 0 END)`,
                    'revenue',
                )
                .where('store.id = :storeId', { storeId: store.id })
                .setParameter('completed', OrderStatus.Completed)
                .groupBy('order.status')
                .getRawMany();

        let pendingCount = 0;
        let completedCount = 0;
        let cancelledCount = 0;
        let revenue = 0;

        for (const row of rows) {
            const count = Number(row.count);
            if (row.status === OrderStatus.Pending) pendingCount = count;
            if (row.status === OrderStatus.Completed) {
                completedCount = count;
                revenue = Number(row.revenue);
            }
            if (row.status === OrderStatus.Cancelled) cancelledCount = count;
        }

        return {
            pendingCount,
            completedCount,
            cancelledCount,
            revenue,
            averageTicket: completedCount ? revenue / completedCount : 0,
        };
    }

    async updateStatus(
        id: string,
        dto: UpdateOrderStatusDto,
        authUser: AuthUser,
    ) {
        const store = await this.storeService.assertStoreAccess(authUser);
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['store', 'items', 'items.product'],
        });

        if (!order || order.store.id !== store.id) {
            throw new NotFoundException('api.order.not.found');
        }

        if (dto.status === OrderStatus.Shipped) {
            if (!dto.fulfillmentMode) {
                throw new BadRequestException('api.order.fulfillment.required');
            }
            order.fulfillmentMode = dto.fulfillmentMode;
        }

        order.status = dto.status;
        await this.orderRepository.save(order);

        await this.safeSendMail(async () => {
            if (!order.customerEmail) return;
            const payload = this.toMailPayload(order, store.name);

            if (dto.status === OrderStatus.Shipped && dto.fulfillmentMode) {
                await this.mailService.sendOrderFulfillmentMail(
                    payload,
                    dto.fulfillmentMode,
                );
            }

            if (dto.status === OrderStatus.Completed) {
                await this.mailService.sendOrderCompletedMail(payload);
            }
        });

        return { message: 'api.order.updated', order };
    }

    async remove(id: string, authUser: AuthUser) {
        const store = await this.storeService.assertStoreAccess(authUser);
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['store'],
        });

        if (!order || order.store.id !== store.id) {
            throw new NotFoundException('api.order.not.found');
        }

        await this.orderRepository.delete(id);
        return { message: 'api.order.deleted' };
    }

    async notifyCustomer(
        id: string,
        dto: NotifyOrderDto,
        authUser: AuthUser,
    ) {
        const store = await this.storeService.assertStoreAccess(authUser);
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['store', 'items', 'items.product'],
        });

        if (!order || order.store.id !== store.id) {
            throw new NotFoundException('api.order.not.found');
        }

        if (!order.customerEmail) {
            throw new BadRequestException('api.order.email.missing');
        }

        const statusLabel =
            order.status === OrderStatus.Completed
                ? 'Finalizado'
                : order.status === OrderStatus.Cancelled
                  ? 'Cancelado'
                  : order.status === OrderStatus.Shipped
                    ? order.fulfillmentMode === FulfillmentMode.Pickup
                        ? 'Pronto para retirada'
                        : 'Enviado'
                    : 'Em andamento';

        await this.mailService.sendOrderUpdateMail(
            this.toMailPayload(order, store.name),
            statusLabel,
            dto.message,
        );

        return { message: 'api.order.notified' };
    }

    private toMailPayload(order: Order, storeName: string): OrderMailPayload {
        return {
            to: order.customerEmail,
            storeName,
            customerName: order.customerName,
            orderId: order.id,
            items: (order.items ?? []).map((item) => ({
                name: item.product?.name ?? 'Produto',
                quantity: item.quantity,
                unitValue: Number(item.unitValue),
            })),
            subtotal: Number(order.subtotal),
            freightAmount: Number(order.freightAmount),
            total: Number(order.total),
            paymentMethod: order.paymentMethod,
            cep: order.cep,
        };
    }

    private async safeSendMail(send: () => Promise<void>) {
        try {
            await send();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            this.logger.error(`Falha ao enviar e-mail do pedido: ${msg}`);
        }
    }

    private async findOneEntity(id: string) {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['items', 'items.product', 'store'],
        });

        if (!order) {
            throw new NotFoundException('api.order.not.found');
        }

        return order;
    }
}
