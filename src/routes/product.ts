import dbProduct from '../db';
import { Product } from '../entity/product';
import express, { Request, Response } from 'express';

const router = express.Router()
const db = dbProduct.getRepository(Product)


router.get('/', async function (req: Request, res: Response) {
  const product = await db.find();
  res.json(product);
});

router.post('/', async function (req: Request, res: Response) {
  const product = await db.create(req.body);
  const result = await db.save(product)
  res.json(result);
});

router.get('/:id', async function (req: Request, res: Response) {
  const id = req.params.id
  const product = await db.findOne({ where: { id: +id }});
  res.json(product);
});

router.put('/:id', async function (req: Request, res: Response) {
  const product = await db.findOne({ where: { id: +req.params.id }});
  if (product) {
    await db.merge(product, req.body);
    const result = await db.save(product)
    res.json(result);
  }
});

router.delete('/:id', async function (req: Request, res: Response) {
  const product = await db.delete(req.params.id);
  res.json(product);
});

router.post('/:id/likes', async function (req: Request, res: Response) {
  const product = await db.findOne({ where: { id: +req.params.id }});
  if (product) {
    product.likes++
    const result = await db.save(product)
    res.json(result)
  }
});

module.exports = router