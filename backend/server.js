require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/auth');
const entriesRoutes = require('./routes/entries');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS — allow the frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || true,
  credentials: true,
}));

app.use(express.json());

// Serve uploaded files statically
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/entries', entriesRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`🌸 Okinawa Diaries backend running on http://localhost:${PORT}`);
});
