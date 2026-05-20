const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const {
  getProducts,
  getProductById,
  createProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// 1. BASE ROUTES
router.route("/")
  .get(getProducts)
  .post(protect, admin, createProduct);

// 2. SEED ROUTE
router.get("/seed", protect, admin, async (req, res) => {
  const products = [
    {
      name: "Minimalist Ash Chair",
      price: 890,
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267",
      description: "Hand-crafted from solid Nordic ash wood.",
      category: "Furniture",
    },
    {
      name: "Alloy Audio Unit",
      price: 1200,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
      description: "Brushed aluminum casing. High-fidelity sound.",
      category: "Audio",
    },
  ];
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    res.send("Products seeded!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 3. BULK CREATE
router.post("/bulk", protect, admin, async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid data format. Please provide an array." });
    }
    const createdProducts = await Product.insertMany(products);
    res.status(201).json(createdProducts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. BULK DELETE — fixed: removed stray 'z' that was crashing the server
router.post("/bulk-delete", protect, admin, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid selection" });
    }
    await Product.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Selected products removed" }); // ← fixed: no stray 'z'
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. SINGLE PRODUCT (dynamic — always at bottom)
router.route("/:id")
  .get(getProductById)
  .delete(protect, admin, async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: "Product removed from collection" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

module.exports = router;