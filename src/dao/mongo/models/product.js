import mongoose from 'mongoose';

const collection = 'Products';

const schema = new mongoose.Schema({
    title:String,
    description:String,
    category:String,
    price:Number,
    thumbnail:String,
    code:String,
    stock:Number,
    status:Boolean
}, {createdAt:'create_at', updatedAt: 'update_at'}
);

const productModel = mongoose.model(collection, schema);

export default productModel;