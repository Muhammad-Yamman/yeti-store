// ─── server.js ─── Express + MongoDB backend for YETI Store
// Run: npm install && node server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ── MongoDB Connection ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/yeti_store")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ── Schemas ─────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  price:    { type: Number, required: true },
  category: { type: String, required: true, enum: ["Coolers","Drinkware","Bags","Gear"] },
  badge:    { type: String, default: "" },
  img:      { type: String },           // emoji or URL
  desc:     { type: String },
  stock:    { type: Number, default: 100 },
  color:    { type: String, default: "#1a1a2e" },
}, { timestamps: true });

const orderSchema = new mongoose.Schema({
  items: [{ productId: mongoose.Types.ObjectId, name: String, price: Number, qty: Number }],
  total: Number,
  email: String,
  status: { type: String, default: "pending" },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
const Order   = mongoose.model("Order",   orderSchema);

// ── Seed Data ────────────────────────────────────────────────
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count > 0) return;
  await Product.insertMany([
    { name: "Rambler 30 oz Tumbler", price: 38,  category: "Drinkware", badge: "Best Seller", img: "🥤", color: "#1a1a2e", desc: "Double-wall vacuum insulation keeps drinks cold 24 hrs." },
    { name: "Tundra 45 Cooler",      price: 325, category: "Coolers",   badge: "New",         img: "🧊", color: "#0f3460", desc: "Rotomolded construction. Bear-resistant certified." },
    { name: "Hopper Flip 18",        price: 250, category: "Coolers",   badge: "",            img: "🏕️", color: "#16213e", desc: "Leakproof top handle soft cooler." },
    { name: "Rambler 64 oz Jug",     price: 60,  category: "Drinkware", badge: "Popular",     img: "🫙", color: "#533483", desc: "Half gallon of cold refreshment." },
    { name: "LoadOut GoBox 30",      price: 250, category: "Gear",      badge: "",            img: "📦", color: "#2c2c54", desc: "Rugged, organized gear storage." },
    { name: "Crossroads 35L Backpack",price:300, category: "Bags",      badge: "New",         img: "🎒", color: "#1a1a2e", desc: "All-terrain backpack." },
    { name: "Camino 50 Carryall",    price: 200, category: "Bags",      badge: "",            img: "👜", color: "#0f3460", desc: "Waterproof carryall." },
    { name: "Trailhead Dog Bed",     price: 200, category: "Gear",      badge: "New",         img: "🐕", color: "#16213e", desc: "Tough, washable, adventure-ready." },
  ]);
  console.log("🌱 Products seeded");
};
mongoose.connection.once("open", seedProducts);

// ── Routes ───────────────────────────────────────────────────

// GET /api/products?category=Coolers&sort=price&page=1&limit=8
app.get("/api/products", async (req, res) => {
  try {
    const { category, sort = "createdAt", page = 1, limit = 20 } = req.query;
    const filter = category && category !== "All" ? { category } : {};
    const sortMap = { price: { price: 1 }, "-price": { price: -1 }, name: { name: 1 } };
    const products = await Product.find(filter)
      .sort(sortMap[sort] || { createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/products/:id
app.get("/api/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/orders
app.post("/api/orders", async (req, res) => {
  try {
    const { items, email } = req.body;
    if (!items?.length) return res.status(400).json({ error: "No items in order" });
    const total = items.reduce((s, i) => s + i.price * i.qty, 0);
    const order = await Order.create({ items, total, email });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/orders/:id
app.get("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get("/api/health", (_, res) => res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
