import { DataSource } from 'typeorm';
import 'reflect-metadata';
import * as dotenv from "dotenv";
import { Product } from './entity/product';

dotenv.config();

const dbProduct = new DataSource({
  type: 'postgres',
  host: process.env.TYPEORM_HOST,
  port: +process.env.TYPEORM_DOCKER_PORT!,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.POSTGRES_PASSWORD,  
  database: process.env.MYSQLDB_DATABASE,
  entities: [Product],
  logging: false,
  synchronize: true,
});

dbProduct
  .initialize()
  .then(async (con) => {
    console.log('Database connection success ');
  })
  .catch((err) => console.log(err));

export default dbProduct;
