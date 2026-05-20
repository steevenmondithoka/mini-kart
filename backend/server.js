const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Import internal modules
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require('./routes/chatRoutes');

// 1. Initialize Environment Variables
dotenv.config();

console.log("Stripe Key Loaded:", process.env.STRIPE_SECRET_KEY);

// 2. Connect to MongoDB
connectDB();

const app = express();

// 3. Global Middleware
app.use(express.json()); // Allows parsing of JSON bodies

// 4. Corrected CORS Configuration
// This allows your React app (on port 5173) to talk to this server
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// 5. API Routes
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", require("./routes/orderRoutes"));
// Add this in your server.js with other routes
app.use('/api/chat', chatRoutes);
app.use('/api/cart', require('./routes/cartRoutes'));         // user-specific cart
app.use('/api/wishlist', require('./routes/wishlistRoutes')); // user-specific wishlist

// 6. Base Route for API Health Check
app.get("/", (req, res) => {
  res.send("Ash Shop API is running beautifully...");
});

// 7. Error Handling Middleware (Optional but recommended)
// Handles 404 (Not Found)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Handles general errors
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded ✓' : 'MISSING ✗');

// 8. Server Listening
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  );
});