import express from "express";
import cors from "cors";       // ✅ import cors
import pkg from "pg";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS middleware
app.use(cors({
  origin: [
    "https://devang.online",
    "https://www.devang.online",
    "https://formdb-vjwp.onrender.com"
  ],
  methods: ["GET", "POST"],
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection (Neon)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // set in Render
  ssl: { rejectUnauthorized: false },         // Neon requires SSL
});

// Test connection
pool.connect()
  .then(() => console.log("✅ Connected to Neon PostgreSQL"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// Serve frontend file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname)); // serves index.html directly

// API: Insert data
app.post("/submit", async (req, res) => {
  const { name } = req.body;
  try {
    await pool.query("INSERT INTO users (name) VALUES ($1)", [name]);
    res.json({ message: "Name saved successfully!" });
  } catch (err) {
    console.error("❌ SQL Error:", err.message);
    res.status(500).json({ message: "Database error: " + err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
