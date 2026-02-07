 import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

console.log('🔥 carts.router.js cargado');

const router = Router();
const cartManager = new CartManager('./src/data/carts.json');

// GET /api/carts
router.get('/', async (req, res) => {
  const carts = await cartManager.getCarts();
  res.json(carts);
});

// POST /api/carts
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(Number(req.params.cid));
  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }
  res.json(cart.products);
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const cart = await cartManager.addProductToCart(
    Number(req.params.cid),
    Number(req.params.pid)
  );

  if (!cart) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  res.json(cart);
});

export default router;
