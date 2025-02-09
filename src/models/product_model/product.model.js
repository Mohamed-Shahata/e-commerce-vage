import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String, required: true
  },
  description: {
    type: String, required: true
  },
  price: {
    type: Number, min: 1, required: true
  },
  discount: {
    type: Number, min: 0, default: 0
  },
  images: [{
    publicId: {
      type: String, required: true
    },
    url: {
      type: String, required: true
    }
  }],
  rate: {
    type: Number, min: 1, max: 5
  },
  review: [{
    user: {
      type: Schema.Types.ObjectId, ref: "User"
    },
    text: {
      type: String
    }
  }],
  category: [{
    type: Schema.Types.ObjectId, ref: "Category", required: true
  }]
}, { timestamps: true });

const Product = model("Product", productSchema);
export default Product;