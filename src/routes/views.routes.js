import { Router } from 'express';
import { ProductModel } from '../model/productModel.js';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const page = req.query.page || 1;

    const result = await ProductModel.paginate({}, {
      page,
      limit: 10,
      lean: true
    });

    res.render('products', {
      products: result.docs,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      currentPage: result.page
    });

  } catch (error) {
    console.log(error);
    res.status(500).send('Error al cargar productos');
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    const product = await ProductModel.findById(pid).lean();

    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    res.render('productDetail', { product });

  } catch (error) {
    console.log(error);
    res.status(500).send('Error al cargar producto');
  }
});

export default router;