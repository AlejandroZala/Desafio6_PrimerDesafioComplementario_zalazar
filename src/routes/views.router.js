import { Router } from "express";
// import ProductManager from "../dao/fileSystem/Managers/productManager.js";
import ProductManager from "../dao/mongo/Managers/productManager.js";
import CartManager from "../dao/mongo/Managers/cartManager.js";

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req,res)=>{
    try {
        const products = await productManager.getProducts();
        res.render('products',{products, css: 'products'});

    } catch (error) {
        res.status(500).send({status:"error", error: "Error al obtener productos"})
    }
});

router.get('/chat', async (req,res)=>{
    res.render('Chat')
});

router.get('/realTimeProducts', async(req,res)=>{
    const products = await productManager.getProducts();
    res.render('realTimeProducts', {products, css: 'realTimeProducts'});
});

router.get('/carts/:cid', async (req,res)=>{
    const cid = req.params.cid;
    const carts = await cartManager.getCarts();
    const cartSelected = carts.find((cart) => cart._id == cid);
    res.render('cart',{cartSelected})
});

export default router;