import { Router } from "express";
// import ProductManager from "../dao/fileSystem/Managers/productManager.js";
import ProductManager from "../dao/mongo/Managers/productManager.js";

const router = Router();
const manager = new ProductManager();

router.get('/', async (req,res)=>{
    try {
        const products = await manager.getProducts();
        res.render('products',{products, css: 'products'});

    } catch (error) {
        res.status(500).send({status:"error", error: "Error al obtener productos"})
    }
});

router.get('/chat', async (req,res)=>{
    res.render('Chat')
});

router.get('/realTimeProducts', async(req,res)=>{
    const products = await manager.getProducts();
    res.render('realTimeProducts', {products, css: 'realTimeProducts'});
})
export default router;