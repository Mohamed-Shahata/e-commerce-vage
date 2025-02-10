import { Schema, model } from "mongoose";
import Product from "./product_model/product.model.js";


const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, ref: "User", required: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId, ref: "Product"
    },
    quantity: {
      type: Number, default: 1
    },
    totalPrice: {
      type: Number, default: 0
    }
  }],
  totalAmmount: {
    type: Number, default: 0
  }
});

cartSchema.pre("save", async function (next) {
  let totalAmmount = 0;
  for (let item of this.items) {
    const product = await Product.findById(item.product);
    item.totalPrice = product.price * item.quantity;
    totalAmmount += item.totalPrice;
  }
  this.totalAmmount = totalAmmount;
  next();
})

const Cart = model("Cart", cartSchema);
export default Cart;