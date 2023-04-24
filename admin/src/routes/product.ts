import dbProduct from '../db';
import { Product } from '../entity/product';
import express, { Request, Response } from 'express';
import amqp from 'amqplib/callback_api';

const router = express.Router();
require('dotenv').config();
const db = dbProduct.getRepository(Product);


amqp.connect(process.env.RABBITMQ_AMQP!, (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel(async (err1, channel) => {
    if (err1) throw err1;
    console.log('RabbitMQ is connected successful');

    router.post('/', async function (req: Request, res: Response) {
      const prod = await db.create(req.body);
      const result = await db.save(prod);

      channel.assertQueue('admin-product-created', { durable: false });
      channel.sendToQueue('admin-product-created', Buffer.from(JSON.stringify(result)));

      res.json(result);
    });

    router.delete('/:id', async function (req: Request, res: Response) {
      const product = await db.delete(req.params.id);

      channel.assertQueue('admin-product-deleted', { durable: false });
      channel.sendToQueue('admin-product-deleted', Buffer.from(req.params.id));

      res.json(product)
    });

    process.on('beforeExit', () => connection.close());
  });
});

router.get('/', async function (req: Request, res: Response) {
  const product = await db.find();
  res.json(product);
});

router.get('/:id', async function (req: Request, res: Response) {
  const id = req.params.id;
  const product = await db.findOne({ where: { id: +id } });
  res.json(product);
});

router.put('/:id', async function (req: Request, res: Response) {
  const product = await db.findOne({ where: { id: +req.params.id } });
  if (product) {
    await db.merge(product, req.body);
    const result = await db.save(product);
    res.json(result);
  }
});

router.post('/:id/likes', async function (req: Request, res: Response) {
  const product = await db.findOne({ where: { id: +req.params.id } });
  if (product) {
    product.likes++;
    const result = await db.save(product);
    res.json(result);
  }
});

module.exports = router;
