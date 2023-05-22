import mongoose from "mongoose";

const collection = "Carts";

const schema = new mongoose.Schema(
  {
    products: {
      type:[
        {
          product:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: "Products"
          },
          quantity: Number
        }
      ],
      default: []
    }
  },{ timestamps:{createdAt: "created_at", updatedAt: "updated_at"}}
);

const cartModel = mongoose.model(collection, schema);

export default cartModel;