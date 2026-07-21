import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Product } from 'src/product/entities/product.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Order, (order) => order.items, {
        nullable: false,
        onDelete: 'CASCADE',
    })
    order: Order;

    @ManyToOne(() => Product, { nullable: false, onDelete: 'RESTRICT' })
    product: Product;

    @Column({ type: 'int', default: 1 })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitValue: number;

    @Column({ type: 'boolean', default: false })
    freight: boolean;

    @Column({ type: 'json', nullable: true })
    customization: { imageUrls: string[] } | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
