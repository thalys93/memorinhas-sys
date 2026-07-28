import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Store } from 'src/store/entities/store.entity';
import { ProductType } from 'src/product-types/entities/product-type.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, type: 'text' })
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    value: number;

    @ManyToOne(() => ProductType, (productType) => productType.products, {
        nullable: false,
        eager: true,
    })
    productType: ProductType;

    @Column({ type: 'int', nullable: true })
    customizableSlots: number | null;

    @Column({ type: 'json', default: [] })
    product_imgs: string[];

    @Column({ type: 'boolean', default: false })
    freight: boolean;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'json', default: [] })
    attributes: Array<{
        fieldId?: string | null;
        type?: string;
        label: string;
        value: string | number | boolean | string[];
    }>;

    @ManyToOne(() => Store, (store) => store.products, {
        onDelete: 'CASCADE',
        nullable: false,
    })
    store: Store;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
