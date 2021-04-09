import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import * as dotenv from 'dotenv';
dotenv.config();


export const TypeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5833,
    username: 'postgres',
    password: process.env.DBPASSWORD,
    database: 'usermanagement',
    autoLoadEntities: true,
    synchronize: true


}