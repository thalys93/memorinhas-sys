import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ProductAttributeFieldType } from 'src/enums/ProductAttributeFieldType';

@Entity('product_attribute_fields')
export class ProductAttributeField {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text', unique: true, nullable: false })
    name: string;

    @Column({
        type: 'enum',
        enum: ProductAttributeFieldType,
        nullable: false,
    })
    type: ProductAttributeFieldType;

    @Column({ type: 'json', default: [] })
    options: string[];

    @Column({ type: 'boolean', default: true })
    active: boolean;

    @Column({ name: 'sort_order', type: 'int', default: 0 })
    sortOrder: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
