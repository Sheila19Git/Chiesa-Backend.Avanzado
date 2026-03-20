import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  code: {
    type: String,
    required: true,
    unique: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  thumbnails: {
    type: [String],
    default: []
  }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

export const ProductModel = model("Product", productSchema);