import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'products', 
          required: true
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1
        }
      }
    ],
    default: []
  }
}, { timestamps: true });

export const CartModel = model('Cart', cartSchema);
