 import { Router } from 'express';
import { ProductModel } from '../model/productModel.js';

const router = Router();


// GET
router.get('/', async (req, res) => {
  try {
    let { limit = 10, page = 1, sort, query } = req.query;
    limit = parseInt(limit);
    page = parseInt(page);
    let filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    const options = { page, limit, lean: true };
    if (sort === 'asc') options.sort = { price: 1 };
    else if (sort === 'desc') options.sort = { price: -1 };

    const result = await ProductModel.paginate(filter, options);
    const baseUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ''}${query ? `&query=${query}` : ''}`
      : null;
    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', error: 'Error al obtener productos' });
  }
});

// GET
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  const product = await ProductModel.findById(pid);
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

// POST
router.post('/', async (req, res) => {
  const product = req.body;
  const newProduct = await ProductModel.create(product);
  const io = req.app.get('io');
  io.emit('actualizarProductos', newProduct);

  res.status(201).json(newProduct);
});

// PUT
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = await ProductModel.findByIdAndUpdate(pid, req.body, { new: true });
  if (!updatedProduct) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(updatedProduct);
});


// DELETE
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await ProductModel.findByIdAndDelete(pid);
  if (!deletedProduct) return res.status(404).json({ error: 'Producto no encontrado' });

  const io = req.app.get('io');
  io.emit('actualizarEliminacion', pid);

  res.json({ message: 'Producto eliminado correctamente' });
});

export default router;