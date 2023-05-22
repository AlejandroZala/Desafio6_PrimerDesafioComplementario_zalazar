import mongoose from "mongoose";
import cartModel from "../models/carts.js";
import ProductManager from "./productManager.js";

const productManager = new ProductManager();

export default class CartManager {

    getCarts = (params) =>{
        return cartModel.find(params).lean();
    }
    getCartBy = (params) =>{
        return cartModel.findOne(params).lean();
    }
    createCart = (cart) => {
        return cartModel.create(cart);
    };
    deleteCart = (id) => {
        return cartModel.findByIdAndDelete(id);
    };
    addProductToCart = async (idCart, idProduct) => {
        await cartModel.updateOne(
            {_id: idCart},
            {$push:{products:{product: new mongoose.Types.ObjectId(idProduct)}}}
        );
    };
};

//---------------------------FILESYSTEM------------------------//    
//   getCarts = async () => {
//     try {
//         const data = fs.existsSync(this.path);
//         if (data) {
//           const info = await fs.promises.readFile(this.path, "utf-8");
//           const productsToAdd = JSON.parse(info);
//           return productsToAdd;
//         } else {
//           console.log("Carts vacío");
//           return [];
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };
//   createCart = async () => {
//     const carts = await this.getCarts();
//     const newCart = {
//       products: [],
//     };
//     if (carts.length === 0) {
//       newCart.id = 1;
//     } else {
//       newCart.id = carts[carts.length - 1].id + 1;
//     }
//     carts.push(newCart);
//     fs.promises.writeFile(this.path, JSON.stringify(carts, null, "\t"));
//   };
//   addProductToCart = async (idCart, productsToAdd) => {
//     const carts = await this.getCarts();
//     const cartSelected = carts.find((c) => c.id == idCart);
//     const yaEstaEnElCarrito = cartSelected.products.find(
//       (p) => p.product == productsToAdd.product
//     );
//     if (!yaEstaEnElCarrito) {
//       cartSelected.products.push(productsToAdd);
//       console.log(productsToAdd);
//     } else {
//       const index = cartSelected.products.findIndex(
//         (p) => p.product == productsToAdd.product
//       );
//       cartSelected.products[index].quantity += productsToAdd.quantity;
//     }
//     const newCart = carts.map((c) =>
//       c.id == idCart ? { ...c, ...cartSelected } : c
//     );
//     fs.promises.writeFile(this.path, JSON.stringify(newCart, null, "\t"));
//   };
//};