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
  priceAfterDiscount: {
    type: Number, min: 0, default: 0
  },
  stockQuantity: {
    type: Number, required: true, default: 0
  },
  stockStatus: {
    type: String, enum: ["In Stock", "Out of Stock", "Low Stock", "Pre-Order", "Backorder"], default: "In Stock"
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
  category: {
    type: Schema.Types.ObjectId, ref: "Category", required: true
  }
}, { timestamps: true });


productSchema.pre("save", function (next) {
  if (this.discount > 0) {
    this.priceAfterDiscount = this.price - (this.price * this.discount) / 100;
  } else {
    this.priceAfterDiscount = this.price;
  };

  if (this.stockQuantity === 0) {
    this.stockStatus = "Out of Stock";
  } else if (this.stockQuantity < 5) {
    this.stockStatus = "Low Stock";
  } else {
    this.stockStatus = "In Stock";
  }
  next();
});

const Product = model("Product", productSchema);
export default Product;