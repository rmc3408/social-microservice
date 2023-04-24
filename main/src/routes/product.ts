import { ObjectId } from 'mongodb';
import dbProduct from '../db';
import { Product } from '../entity/product';
import express, { Request, Response } from 'express';
import amqp, { ConsumeMessage } from 'amqplib';

const router = express.Router();
require('dotenv').config();
const db = dbProduct.getMongoRepository(Product);

(async () => {
  const connection = await amqp.connect(process.env.RABBITMQ_AMQP!);
  console.log('RabbitMQ is connected successful');

  const channel = await connection.createChannel();
  
  await channel.assertQueue('admin-product-created', { durable: false });
  await channel.assertQueue('admin-product-deleted', { durable: false });

  channel.consume('admin-product-created', async (msg) => {
    if (msg !== null) {
      
      createProductQueue(msg)
      channel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

  channel.consume('admin-product-deleted', async (msg) => {
    if (msg !== null) {
      
      deleteProductQueue(msg)
      channel.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

})();

async function createProductQueue(msg: ConsumeMessage) {
  const eventProduct = JSON.parse(msg.content.toString());
  const generalProduct = new Product();

  generalProduct.admin_id = +eventProduct.id;
  generalProduct.name = eventProduct.name;
  generalProduct.image = eventProduct.image;
  generalProduct.likes = eventProduct.likes;

  const result = await db.save(generalProduct);
  console.log('Product Received:', msg.content.toString());
  console.log('Product created');
}

async function deleteProductQueue(msg: ConsumeMessage) {
  const id = msg.content.toString()
  console.log('Product will be deleted:', id);
  const result = await db.deleteOne({ admin_id: +id });
  console.log('Product deleted', result);
}

router.get('/', async function (req: Request, res: Response) {
  const product = await db.find();
  res.json(product);
});

router.get('/:id', async function (req: Request, res: Response) {
  const id = req.params.id;
  const product = await db.findOneBy({ _id: new ObjectId(id) });
  res.json(product);
});

module.exports = router;
