const path = require("path");
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

app.use(express.json());

// Static frames for AR overlays
app.use(
  '/frames',
  express.static(path.join(__dirname, 'public', 'frames'))
);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payment", paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error' });
});

// -----------------------------
// SERVER START LOGIC
// -----------------------------
const BASE_PORT = parseInt(process.env.PORT) || 4000;

function startServer(port, attemptsLeft = 10) {
  const server = app.listen(port, () => {
    console.log(`✓ OptiFrame API running on http://localhost:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && attemptsLeft > 0) {
      console.log(`Port ${port} in use. Trying ${port + 1}...`);
      startServer(port + 1, attemptsLeft - 1);
    } else {
      console.error('Failed to start server:', err);
      process.exit(1);
    }
  });
}

// Connect DB first, then start server
connectDB()
  .then(() => {
    console.log('✓ MongoDB connected');
    startServer(BASE_PORT);
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Server terminated');
  process.exit(0);
});

// Serve frontend build
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});