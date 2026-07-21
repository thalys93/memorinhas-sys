import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Store } from 'src/store/entities/store.entity';
import { OrderStatus } from 'src/enums/OrderStatus';
import { FreightType } from 'src/enums/FreightType';
import { FulfillmentMode } from 'src/enums/FulfillmentMode';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Store, { nullable: false, onDelete: 'CASCADE' })
    store: Store;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
    status: OrderStatus;

    @Column({ name: 'customer_name', type: 'varchar', length: 120 })
    customerName: string;

    @Column({ name: 'customer_phone', type: 'varchar', length: 20 })
    customerPhone: string;

    @Column({ name: 'customer_email', type: 'varchar', length: 160, default: '' })
    customerEmail: string;

    @Column({ type: 'varchar', length: 9 })
    cep: string;

    @Column({ name: 'payment_method', type: 'varchar', length: 60 })
    paymentMethod: string;

    @Column({
        name: 'freight_amount',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 0,
    })
    freightAmount: number;

    @Column({
        name: 'freight_type',
        type: 'enum',
        enum: FreightType,
        default: FreightType.Standard,
    })
    freightType: FreightType;

    @Column({
        name: 'fulfillment_mode',
        type: 'enum',
        enum: FulfillmentMode,
        nullable: true,
    })
    fulfillmentMode: FulfillmentMode | null;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    subtotal: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    total: number;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: ['insert'] })
    items: OrderItem[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
