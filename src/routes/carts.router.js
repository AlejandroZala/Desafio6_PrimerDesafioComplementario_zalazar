import { Router } from "express";
import CartManager from "../dao/mongo/Managers/cartManager.js";
import ProductManager from "../dao/mongo/Managers/productManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();
// const carts = cartManager.getCarts();
// const products = productManager.getProducts();

// Obtengo todos los carritos
router.get('/', async (req, res) => {
  try {
    const carts = await cartManager.getCarts();
    res.send({ status: 'success', payload: carts });
  } catch (error) {
    console.log(err)
  }
});
// Obtengo carrito por ID
router.get(`/:cid`, async (req, res) => {
  try {
    const  cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);

   // console.log(JSON.stringify(cart, null, '\t'))
    res.send({status: 'success', payload: cart})
  } catch (err) {
    console.log(err);
    return res.status(404).send({ status: "error", error: "Cart not found" });
  }
});
// Creo nuevo carrito
router.post(`/`, async (req, res) => {
  try {
    cartManager.createCart();
    res.send("Cart created");
  } catch (error) {
    console.log(error);
    return res.status(404).send({ status: "error", error: "Cart not created" });
  }
});

// Agrego un producto al carrito
router.post(`/:cid/product/:pid`, async (req, res) => {
  try {
    let { cid, pid } = req.params;
    const { quantity } = req.body;
    const checkIdProduct = await productManager.getProductBy({ _id: pid });
    if ('error' in checkIdProduct) 
      return res.status(404).send({error: `The ID product: ${pid} not found`})

    const checkIdCart = await cartManager.getCartById(cid)
    if ('reason' in checkIdCart) 
      return res.status(404).send({error: `The ID cart: ${cid} not found`})

    const result = await cartManager.addProducInCart(cid, { _id: pid, quantity })
    
    return res.status(200).send(
      {message:`added product ID: ${pid}, in cart ID: ${cid}`, cart: result});

  // try{
  //   const { cid, pid } = req.params;
  //   const cart = await  cartManager.addProductToCart(cid, pid);
  //   console.log(JSON.stringify(cart,null, '\t'))
  //   res.send({status: 'success', payload:cart })
  }
  catch(err){
    console.log(err)
  }
});

  // Elimino  producto del carrito
  router.delete('/:cid/product/:pid',async (req, res) => {
    try {
      const { cid, pid } = req.params
      const checkIdProduct = await productManager.getProductBy({ _id: pid });
      if ('error' in checkIdProduct) 
        return res.status(404).send({error: `The ID product: ${pid} not found`})

      const checkIdCart = await cartManager.getCartById(cid)
      if ('reason' in checkIdCart) 
        return res.status(404).send({error: `The ID cart: ${cid} not found`})
      
      const findProduct = checkIdCart.products.findIndex(
        (element) => element._id._id.toString() === checkIdProduct._id.toString())

      if(findProduct === -1) 
        return res.status(404).send({error: `The ID product: ${pid} not found in cart`})
      
      checkIdCart.products.splice(findProduct, 1)
      
      const cart = await cartManager.deleteProductInCart(cid, checkIdCart.products)    

      return res.status(200).send({status:'success', message:`deleted product ID: ${pid}`, cart })
    // try{
    //   const { cid, pid } = req.params;
    //   const cart = cartManager.deleteProductToCart(cid, pid);
    //   res.send({status: 'success', payload: cart})
    }
    catch(err){
      console.log(err)
    }
  });

    // Eliminar un carrito por ID
  router.delete('/:id',async (req, res) => {
    try{
      const { id } = req.params;
      await cartManager.deleteCart(id);
      const cart = await cartManager.getCarts();
      req.io.emit('carts', cart);
      res.send({status: 'success', payload: cart})
    }
  catch(err){
    console.log(err)
  }
  });

// router.post(`/:cId/product/:pId`, async (req, res) => {
//   const allCarts = await carts;
//   const idCart = req.params.cId;
//   const CartExist = allCarts.find((c) => c._id == idCart);
//   if (!CartExist) {
//     return res.status(404).send({ status: "error", error: "Cart not found" });
//   }
//   const idProduct = req.params.pId;
//   let quantity = req.body.quantity;
//   quantity ? (quantity = quantity) : (quantity = 1);
//   const allProducts = await products;
//   const productSelected = allProducts.find((p) => p._id == idProduct);
//   productSelected
//     ? res.send({ status: "succes ", code: "Product and Cart found" })
//     : res.send("Product not found");
//   const productSelectedId = productSelected._id;
//   const cartToSend = {
//     product: productSelectedId,
//     quantity: quantity,
//   };
//   cartManager.addProductToCart(idCart, cartToSend);
// });

export default router;
