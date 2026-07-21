import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity('product_types')
export class ProductType {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true, nullable: false })
    name: string;

    @Column({ type: 'boolean', default: false })
    isCustomizable: boolean;

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @OneToMany('Product', 'productType')
    products: unknown[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
