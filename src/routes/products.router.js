 import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./src/data/products.json');

// GET 
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// GET 
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await productManager.getProductById(pid);

  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(product);
});

// POST 
router.post('/', async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  } = req.body;

  if (
    !title ||
    !description ||
    !code ||
    price === undefined ||
    stock === undefined ||
    !category
  ) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const newProduct = await productManager.addProduct({
    title,
    description,
    code,
    price,
    status: status ?? true,
    stock,
    category,
    thumbnails: thumbnails || []
  });

  res.status(201).json(newProduct);
});

// PUT 
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = await productManager.updateProduct(pid, req.body);

  if (!updatedProduct) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json(updatedProduct);
});

// DELETE 
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const deleted = await productManager.deleteProduct(pid);

  if (!deleted) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }

  res.json({ message: 'Producto eliminado correctamente' });
});

export default router;

