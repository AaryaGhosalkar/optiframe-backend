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

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// API routes
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);

// Auth (simple for now)
app.post("/api/auth/register", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await mongoose.connection.collection("users").findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await mongoose.connection.collection("users").insertOne({
      name,
      email,
      password
    });

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }

});

app.post("/api/auth/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await mongoose.connection.collection("users").findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "User not registered" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    res.status(200).json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Serve frontend
const distPath = path.join(__dirname, "dist");

app.use("/uploads", express.static("uploads"));
app.use(express.static(distPath));

// IMPORTANT: this fixes React routes like /admin /products /tryon
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});