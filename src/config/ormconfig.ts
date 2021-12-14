import {ConnectionOptions} from 'typeorm';
import { Merchant } from '../entities/merchant.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';

const config : ConnectionOptions = {
    name : 'sales',
    type : 'postgres',
    host :  process.env.POSTGRES_HOST || 'localhost',
    port :  Number(process.env.POSTGRES_PORT) || 5432,
    username :  process.env.POSTGRES_USERNAME || 'postgres',
    password : process.env.POSTGRES_PASSWORD || '1711877874',
    database : process.env.POSTGRES_DB || 'sales',
    synchronize : true,
    entities: [
        User,Product,Merchant
    ],
    cli: {
        migrationsDir: 'src/migrations',
    }
}
export = config;