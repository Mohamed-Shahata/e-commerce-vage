import { Schema, model } from "mongoose";
import bcryptjs from "bcryptjs";

const userScehma = new Schema({
  firstName: {
    type: String,
    default: ""
  },
  lastName: {
    type: String,
    default: ""
  },
  image: {
    publicId: {
      type: String, default: ""
    },
    url: {
      type: String, default: "user.png"
    }
  },
  phoneNumber: {
    type: Number,
    default: 0
  },
  email: {
    type: String, required: true, unique: true
  },
  password: {
    type: String, required: true
  },
  streetAddress: {
    type: String, default: ""
  },
  country: {
    type: String, default: ""
  },
  states: {
    type: String, default: ""
  },
  zipCode: {
    type: String, default: ""
  },
  isVerified: {
    type: Boolean, default: false
  },
  verification: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  refreshToken: {
    type: String,
    default: null
  },
  orders: [{
    type: Schema.Types.ObjectId
  }],
  cart: [{
    type: Schema.Types.ObjectId
  }]
}, {
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      return ret
    }
  },
  toObject: {
    transform(doc, ret) {
      delete ret.password;
      delete ret.refreshToken;
      return ret
    }
  }
}
  , { timestamps: true });

userScehma.pre("save", async function (next) {
  if (!this.isModified("password"))
    return next();

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});


const User = model("User", userScehma);
export default User;