 import fs from 'fs';
import path from 'path';

export default class CartManager {
  constructor(filePath) {
    this.path = path.resolve(filePath);
  }

  async getCarts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, 'utf-8');
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error al leer carritos:', error);
      return [];
    }
  }

  async createCart() {
    const carts = await this.getCarts();

    const newCart = {
      id: carts.length === 0 ? 1 : carts[carts.length - 1].id + 1,
      products: []
    };

    carts.push(newCart);
    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));

    return newCart;
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id == id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id == cid);

    if (!cart) return null;

    const productInCart = cart.products.find(p => p.product == pid);

    if (productInCart) {
      productInCart.quantity++;
    } else {
      cart.products.push({
        product: pid,
        quantity: 1
      });
    }

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

