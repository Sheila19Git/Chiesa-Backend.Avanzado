import { Router } from 'express';
import { ProductModel } from '../model/productModel.js';

const router = Router();

// Vista productos
router.get('/products', async (req, res) => {
  try {
    const result = await ProductModel.paginate({}, { lean: true });

    res.render('products', {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage
    });

  } catch (error) {
    res.status(500).send('Error al cargar productos');
  }
});

// Vista detalle
router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('productDetail', { product });

  } catch (error) {
    res.status(500).send('Error al cargar producto');
  }
});

export default router;