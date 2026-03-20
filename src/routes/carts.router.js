import { Router } from 'express';
import { CartModel } from '../model/cartModel.js'; // tu modelo de Cart en MongoDB

const router = Router();

// GET-todos los carritos
router.get('/', async (req, res) => {
  const carts = await CartModel.find().lean();
  res.json(carts);
});

// POST-crear carrito vacío
router.post('/', async (req, res) => {
  const newCart = await CartModel.create({ products: [] });
  res.status(201).json(newCart);
});

// GET-carrito por ID con productos completos
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await CartModel.findById(cid).populate('products.product').lean();
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
  res.json(cart);
});

// POST-agregar producto al carrito
router.post('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  const existingProduct = cart.products.find(p => p.product.toString() === pid);
  if (existingProduct) existingProduct.quantity += 1;
  else cart.products.push({ product: pid, quantity: 1 });

  await cart.save();
  res.json(cart);
});

// PUT-actualizar todos los productos del carrito
router.put('/:cid', async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  cart.products = products;
  await cart.save();
  res.json(cart);
});

// PUT-actualizar solo cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  const productInCart = cart.products.find(p => p.product.toString() === pid);
  if (!productInCart) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

  productInCart.quantity = quantity;
  await cart.save();
  res.json(cart);
});

// DELETE-producto especifico
router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();
  res.json(cart);
});

// DELETE
router.delete('/:cid', async (req, res) => {
  const { cid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  cart.products = [];
  await cart.save();
  res.json({ message: 'Carrito vaciado correctamente' });
});

export default router;
