import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

// ================= PATH SETUP =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= DATABASE =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= STATIC FILES =================

// serve frames/images
app.use("/frames", express.static(path.join(__dirname, "public/frames")));

// ================= API ROUTES =================

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// ================= AUTH ROUTES =================

app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email } = req.body;

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
    const { email } = req.body;

    res.status(200).json({
      message: "Login successful",
      user: { email },
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// ================= SERVE FRONTEND =================

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});