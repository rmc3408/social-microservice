import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const productsRouter = require('./routes/product') 

require('dotenv').config();
const PORT = process.env.NODE_PORT || 3000;

const app = express();
const corsOptions = {
  origin: ['http://localhost:5433', 'http://localhost:3000'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json())
app.use('/product', productsRouter)


app.listen(PORT, () => {
  console.log(`🚀 Admin Server is running on port ${PORT}`);
});