import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column("varchar")
    full_name! : string;

    @Column()
    username! : string;

    @Column()
    password! : string;

    @Column()
    phone_number! : string;

    @Column('time')
    created_at! : Date;

    @Column()
    access_token!: string;

    @Column()
    refresh_token!: string;

}