import { DataSource } from 'typeorm';
import 'reflect-metadata';
import amqp from 'amqplib/callback_api';
import * as dotenv from "dotenv";
import { Product } from './entity/product';

dotenv.config();

const dbProduct = new DataSource({
  type: 'mongodb',
  host: process.env.TYPEORM_HOST,
  database: process.env.TYPEORM_DATABASE,
  entities: [Product],
  logging: false,
  synchronize: true,
});

dbProduct
  .initialize()
  .then(async (con) => {
    console.log('MongoDB Database connection successful');
  })
  .catch((err) => console.log(err));

export default dbProduct;
