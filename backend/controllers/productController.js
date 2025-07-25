const Product = require('../models/Product');



// add products only for admin 
exports.addProduct = async (req, res) => {
  try {
    const {name, description, price, ratings, category, image} = req.body;
    
    if (!name || !description || !price || !ratings || !category || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newProduct = new Product({ name, description, price, ratings, category, image });
    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
 
  } catch (error) {
    res.status(500).json({ message: "Failed to add product", error: error.message });
    
  }

};





//get all products

exports.getAllProducts = async(req,res)=>{
    try {
        const products = await Product.find();
        res.status(200).json({ message: "Products retrieved successfully", products });
        
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve products", error: error.message });
    }
}

//get product by id
exports.getProductsById = async(req,res)=>{
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product retrieved successfully", product });
        

    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve product", error: error.message });
    }
}


// get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category });
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category" });
    }
    res.status(200).json({ message: "Products retrieved successfully", products });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve products", error: error.message });
  }
}


// add multiple products
// Expecting an array of products in the request body

exports.addMultipleProducts = async (req, res) => {
  try {
    const products = req.body.products; // Expecting: { "products": [ ... ] }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid product data" });
    }

    const savedProducts = await Product.insertMany(products);

    res.status(201).json({
      message: "Products added successfully",
      products: savedProducts
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add products",
      error: error.message
    });
  }
};

