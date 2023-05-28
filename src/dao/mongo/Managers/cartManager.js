import cartModel from "../models/carts.js";

export default class CartManager {

    createCart = (cart) => {
        return cartModel.create(cart);
    };
    getCarts = (params) =>{
        return cartModel.find(params).lean();
    }
    getCartById = (cid) =>{
        return cartModel.findOne({_id:cid}).lean();
    }
    deleteCart = async (cid) => {
        try {
            const deletedCart = await cartModel.findByIdAndDelete(cid);
            if (!deletedCart) {
                throw new Error("Carrito no encontrado");
            }
            return deletedCart;
        } catch (error) {
                throw new Error(error.message);
        }
    };

    addProductToCart = async (cid, pid) => {
        try {
          // Obtén el carrito correspondiente al ID (cid)
          let cart = await cartModel.findById(cid);
          if (!cart) {
            throw new Error("Carrito no encontrado");
          }
          // Busca el índice del producto en el arreglo de productos
          const existingProductIndex = cart.products.findIndex(
            (product) => product.product == pid
          );
          if (existingProductIndex !== -1) {
            // Si el producto ya existe en el carrito, incrementa la cantidad en 1
            cart.products[existingProductIndex].quantity += 1;
          } else {
            // Si el producto no existe en el carrito, agrégalo al arreglo de productos
            cart.products.push({ product: pid, quantity: 1 });
          }
          // Guarda los cambios en la base de datos
          cart = await cart.save();
          return cart;
        } catch (error) {
          throw new Error(error.message);
        }
      };

    deleteProductToCart = async (cid, pid) => {
        try {
          let cart = await cartModel.findById(cid);
          if (!cart) {
            throw new Error("Carrito no encontrado");
          }
          console.log(cart.products);
          const existingProductIndex = cart.products.findIndex(
            (product) => product.product == pid
          );
          if (existingProductIndex !== -1) {
            // Elimina el producto del arreglo de productos del carrito
            cart.products.splice(existingProductIndex, 1);
          } else {
            // Si el producto no existe en el carrito, avisame
            throw new Error("producto no encontrado");
          }
          cart = await cart.save();
        } catch (error) {
          throw new Error(error.message);
        }
      };

    updateProductInCart = async (cid, pid, newQuantity) => {
        try {
          const cartToUpdate = await cartModel.findById(cid);
          if (!cartToUpdate) {
            throw new Error("Carrito no encontrado");
          }
          const existingProductIndex = cartToUpdate.products.findIndex(
            (product) => product.product == pid
          );
          if (existingProductIndex === -1) {
            throw new Error("Producto no encontrado en el carrito");
          }
          console.log(cartToUpdate.products[existingProductIndex]);
    
          const product = cartToUpdate.products[existingProductIndex].product;
    
          cartToUpdate.products[existingProductIndex] = {
            product: product,
            quantity: newQuantity.quantity,
          };
    
          const updatedCart = await cartToUpdate.save();
          return updatedCart;
        } catch (error) {
          console.log(error);
        }
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