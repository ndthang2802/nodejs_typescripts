import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('merchants')
export class Merchant  {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    merchant_name! : string;

    @Column()
    created_at! : Date;

    @Column()
    admin_id! : string;

}