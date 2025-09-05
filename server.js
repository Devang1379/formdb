import express from "express";
import mysql from "mysql2";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL connection (use Neon DB instead of localhost)
const db = mysql.createConnection({
  host: "your-neon-host",   // example: ep-long-123456.ap-southeast-1.aws.neon.tech
  user: "your-neon-username",
  password: "your-neon-password",
  database: "formdb",
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL (Neon) connected...");
});

// serve frontend file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname)); // serves index.html directly

// API
app.post("/submit", (req, res) => {
  const { name } = req.body;
  const sql = "INSERT INTO users (name) VALUES (?)";
  db.query(sql, [name], (err, result) => {
    if (err) {
      console.error("❌ SQL Error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error: " + err.sqlMessage });
    }
    res.json({ message: "Name saved successfully!" });
  });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
