const Product = require("../models/Product");

// @desc    Get all products with Search functionality
// @route   GET /api/products
// @desc    Get all products (with Search & Category filter)
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    // 1. Filter by Search Keyword
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: "i" } }
      : {};

    // 2. Filter by Category (New Logic)
    // If category is "All" or not provided, we don't add a category filter
    const category =
      req.query.category && req.query.category !== "All"
        ? { category: req.query.category }
        : {};

    // 3. Find products matching BOTH keyword AND category
    const products = await Product.find({ ...keyword, ...category });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create product (Admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
