import { Router } from "express";
import CartManager from "../dao/mongo/Managers/cartManager.js";
import ProductManager from "../dao/mongo/Managers/productManager.js";

const router = Router();
const cartManager = new CartManager();
const productManager = new ProductManager();
const carts = cartManager.getCarts();
const products = productManager.getProducts();

router.get('/', async (req, res) => {
  const carts = await cartManager.getCarts();
  res.send({ status: 'success', payload: carts });
});
router.get(`/:cId`, async (req, res) => {
  try {
    const idCart = req.params.cId;
    const allCarts = await carts;
    const selected = allCarts.find((c) => c.id == idCart);
    res.send(selected);
  } catch (error) {
    console.log(error);
    return res.status(404).send({ status: "error", error: "Cart not found" });
  }
});
router.post(`/`, async (req, res) => {
  try {
    cartManager.createCart();
    res.send("Cart created");
  } catch (error) {
    console.log(error);
    return res.status(404).send({ status: "error", error: "Cart not created" });
  }
});
router.post(`/:cId/product/:pId`, async (req, res) => {
  const allCarts = await carts;
  const idCart = req.params.cId;
  const CartExist = allCarts.find((c) => c._id == idCart);
  if (!CartExist) {
    return res.status(404).send({ status: "error", error: "Cart not found" });
  }
  const idProduct = req.params.pId;
  let quantity = req.body.quantity;
  quantity ? (quantity = quantity) : (quantity = 1);
  const allProducts = await products;
  const productSelected = allProducts.find((p) => p._id == idProduct);
  productSelected
    ? res.send({ status: "succes ", code: "Product and Cart found" })
    : res.send("Product not found");
  const productSelectedId = productSelected._id;
  const cartToSend = {
    product: productSelectedId,
    quantity: quantity,
  };
  cartManager.addProductToCart(idCart, cartToSend);
});

export default router;
