// This file handles all product-related operations like searching, listing, and retrieving product details

// Import the product database structure
import PRODUCT from "../models/product.js";

// Get all products in a specific category
export const getproduct = async (req, res) => {
    const {cat} = req.query;  // Get category from the request
    const products = await PRODUCT.find({category:cat});  // Find all products in that category
    if (products.length==0) return res.json({message: `Products not found with category ${cat}`})  // If no products found
    return res.json({success: true, message: `Products with category ${cat}`,items: products.length, products})  // Return found products
}

// Get all active products in the store
export const getallproducts = async (req,res) => {
    // Find all products that are active (available for sale)
    const products = await PRODUCT.find({isActive: true}).lean();
    if (products.length==0) return res.json({message: `Products not found`})
    
    // Format each product to have a consistent structure
    const formattedProducts = products.map(p => {
        const {...rest} = p;
        return {
          productID: p._id,  // Rename _id to productID for clarity
          ...rest
        }
    });
    return res.json({success: true, message: `All Products`,items: products.length, products: formattedProducts})
}

// Get detailed information about a specific product
export const getproductsbyid = async (req, res) => {
    const {id} = req.query;  // Get product ID from the request
    // Find product and include vendor (seller) information
    const product = await PRODUCT.findOne({_id: id}).lean().populate("vendor");
    const {...rest} = product
    const formattedProduct = {
        productID: product._id,
        ...rest
    }
    res.json({success: true, product: formattedProduct})
}

// Search for products by name
export const searchProduct = async (req, res) => {
  try {
    const { name } = req.query;  // Get search term from request
    let products = [];

    if (name) {
      // Find products whose names match the search term (case insensitive)
      const matchedProducts = await PRODUCT.find({
        name: { $regex: name, $options: "i" },
        isActive: true  // Only show active products
      }).lean();

      if (matchedProducts.length > 0) {
        // Get all products from the same categories as matched products
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

export const getCategories = async (req, res) => {
  try {
    const products = await PRODUCT.find({isActive: true});

    const categories = [];

    for (const product of products) {
      const existingCategory = categories.find(
        (c) => c.Categoryname === product.category
      );

      if (existingCategory) {
        existingCategory.no_of_items += 1;
      } else {
        categories.push({
          Categoryname: product.category,
          no_of_items: 1,
          img_link: product.images?.[0] || "",
        });
      }
    }

    return res.status(200).json({ success: true, categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};