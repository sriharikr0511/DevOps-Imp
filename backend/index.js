const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create table on startup (retry until DB is ready)
async function initDB() {
  for (let i = 0; i < 10; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS tasks (
          id        SERIAL PRIMARY KEY,
          title     TEXT    NOT NULL,
          done      BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
      `);
      console.log("✅ Database ready");
      return;
    } catch (err) {
      console.log(`⏳ Waiting for DB... attempt ${i + 1}`);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  throw new Error("Could not connect to database");
}

// GET /tasks
app.get("/tasks", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM tasks ORDER BY created_at DESC"
  );
  res.json(rows);
});

// POST /tasks
app.post("/tasks", async (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "Title required" });
  const { rows } = await pool.query(
    "INSERT INTO tasks (title) VALUES ($1) RETURNING *",
    [title.trim()]
  );
  res.status(201).json(rows[0]);
});

// PATCH /tasks/:id  — toggle done
app.patch("/tasks/:id", async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

// DELETE /tasks/:id
app.delete("/tasks/:id", async (req, res) => {
  await pool.query("DELETE FROM tasks WHERE id = $1", [req.params.id]);
  res.status(204).send();
});

// Health check (useful for Docker)
app.get("/health", (req, res) => res.json({ status: "ok" }));

initDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
});
