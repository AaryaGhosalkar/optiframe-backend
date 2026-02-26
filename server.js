import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

app.use("/api/payment", paymentRoutes);

dotenv.config();

const app = express();
app.use(express.json());

// ================= DB =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= API ROUTES =================
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ================= AUTH ROUTES =================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    res.status(201).json({
      message: "User registered successfully",
      user: { name, email },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    res.status(200).json({
      message: "Login successful",
      user: { email },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ================= SERVE FRONTEND =================

// IMPORTANT PART
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from dist
app.use(express.static(path.join(__dirname, "dist")));

// Catch-all (VERY IMPORTANT)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ================= START =================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));