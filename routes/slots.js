const router = require("express").Router();
const crypto = require("crypto");
const db = require("../db");
const { protect, onlyRole } = require("../middleware/auth");

// 1) Alumni creates a slot
router.post("/", protect, onlyRole("alumni"), async (req, res) => {
  try {
    const { start_time } = req.body;

    if (!start_time) {
      return res.status(400).json({ error: "start_time is required" });
    }

    await db.query("INSERT INTO slots (alumni_id, start_time) VALUES (?, ?)", [
      req.user.id,
      start_time,
    ]);

    res.json({ message: "Slot created" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ error: "You already have a slot at this time" });
    }
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2) Free upcoming slots of one alumni
router.get("/alumni/:id", protect, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, start_time FROM slots
       WHERE alumni_id = ? AND student_id IS NULL AND start_time > NOW()
       ORDER BY start_time`,
      [req.params.id],
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 3) Student books a slot
router.post("/:id/book", protect, onlyRole("student"), async (req, res) => {
  try {
    const room = "alumni-connect-" + crypto.randomBytes(6).toString("hex");

    const [result] = await db.query(
      "UPDATE slots SET student_id = ?, room_name = ? WHERE id = ? AND student_id IS NULL",
      [req.user.id, room, req.params.id],
    );

    if (result.affectedRows === 0) {
      return res
        .status(409)
        .json({ error: "Slot not available or already booked" });
    }

    res.json({ message: "Slot booked", room });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 4) My booked calls
router.get("/mine", protect, async (req, res) => {
  try {
    const col = req.user.role === "student" ? "s.student_id" : "s.alumni_id";

    const [rows] = await db.query(
      `SELECT s.id, s.start_time, s.room_name,
              a.name AS alumni_name, st.name AS student_name
       FROM slots s
       JOIN users a ON a.id = s.alumni_id
       LEFT JOIN users st ON st.id = s.student_id
       WHERE ${col} = ? AND s.student_id IS NOT NULL
       ORDER BY s.start_time`,
      [req.user.id],
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
