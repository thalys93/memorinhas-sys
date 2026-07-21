import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { StoreSettings } from '../interfaces/store-settings.interface';

@Entity('stores')
export class Store {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false, type: 'text' })
    name: string;

    @Column({ nullable: false, type: 'text', unique: true })
    brand_url: string;

    @Column({ type: 'int', default: 0 })
    sales: number;

    @Column({ type: 'json', default: {} })
    settings: StoreSettings;

    @ManyToMany(() => User, (user) => user.stores)
    @JoinTable({ name: 'store_keepers' })
    keepers: User[];

    @OneToMany(() => Product, (product) => product.store)
    products: Product[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
