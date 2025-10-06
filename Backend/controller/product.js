import PRODUCT from "../models/product.js";

export const getproduct = async (req, res) => {
    const {cat} = req.query;
    const products = await PRODUCT.find({category:cat});
    if (products.length==0) return res.json({message: `Products not found with category ${cat}`})
    return res.json({success: true, message: `Products with category ${cat}`,items: products.length, products})
}

export const getallproducts = async (req,res) => {
    const products = await PRODUCT.find({isActive: true}).select("-stock").lean();
    if (products.length==0) return res.json({message: `Products not found`})
    const formattedProducts = products.map(p => ({
        productID: p._id,
        ...p
    }));
    return res.json({success: true, message: `All Products`,items: products.length, products: formattedProducts})
}

export const getproductsbyid = async (req, res) => {
    const {id} = req.query;
    const product = await PRODUCT.findOne({_id: id}).select("-stock").lean().populate("vendor");
    const formattedProduct = {
        productID: product._id,
        ...product
    }
    res.json({success: true, product: formattedProduct})
}