import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';
export enum product_status {
    OUT_OF_STOCK = "out_of_stock",
    IN_STOCK = "in_stock",
    RUNNING_LOW = "running_low"
}
@Entity('products')
export class Product  {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name! : string;

    @Column()
    merchant_id! : string;

    @Column()
    price! : number;

    @Column()
    status! : product_status;

    @Column()
    created_at! : Date;
}