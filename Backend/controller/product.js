import PRODUCT from "../models/product.js";

export const getproduct = async (req, res) => {
    const {cat} = req.query;
    const products = await PRODUCT.find({category:cat});
    if (products.length==0) return res.json({message: `Products not found with category ${cat}`})
    return res.json({success: true, message: `Products with category ${cat}`,items: products.length, products})
}

export const getallproducts = async (req,res) => {
    const products = await PRODUCT.find({isActive: true}).lean();
    if (products.length==0) return res.json({message: `Products not found`})
    const formattedProducts = products.map(p => {
        const {stock, ...rest} = p;
        return {
          productID: p._id,
          inStock: stock>0,
          ...rest
        }
    });
    return res.json({success: true, message: `All Products`,items: products.length, products: formattedProducts})
}

export const getproductsbyid = async (req, res) => {
    const {id} = req.query;
    const product = await PRODUCT.findOne({_id: id}).lean().populate("vendor");
    const {stock, ...rest} = product
    const formattedProduct = {
        productID: product._id,
        inStock: stock > 0,
        ...rest
    }
    res.json({success: true, product: formattedProduct})
}

export const searchProduct = async (req, res) => {
  try {
    const { name } = req.query;
    let products = [];

    if (name) {
      const matchedProducts = await PRODUCT.find({
        name: { $regex: name, $options: "i" },
        isActive: true
      }).lean();

      if (matchedProducts.length > 0) {
        const categories = [...new Set(matchedProducts.map(p => p.category))];
        const categoryProducts = await PRODUCT.find({
          category: { $in: categories },
          isActive: true
        }).lean();

        const allProductsMap = new Map();
        [...matchedProducts, ...categoryProducts].forEach(p => {
          allProductsMap.set(p._id.toString(), p);
        });

        products = Array.from(allProductsMap.values());
      }
    } else {
      products = await PRODUCT.find({ isActive: true }).lean();
    }

    const formattedProducts = products.map(product => ({
      productID: product._id,
      inStock: product.stock > 0,
      ...product
    }));

    res.status(200).json({ success: true, data: formattedProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};