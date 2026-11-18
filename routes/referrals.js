const router = require("express").Router();
const db = require("../db");
const { protect, onlyRole } = require("../middleware/auth");

// 1) Student sends a referral request
router.post("/", protect, onlyRole("student"), async (req, res) => {
  try {
    const { alumni_id, message, resume_link } = req.body;

    if (!alumni_id || !message) {
      return res
        .status(400)
        .json({ error: "alumni_id and message are required" });
    }

    // alumni_id oru verified alumni thaana nu check
    const [alumni] = await db.query(
      "SELECT id FROM users WHERE id = ? AND role = 'alumni' AND is_verified = TRUE",
      [alumni_id],
    );
    if (alumni.length === 0) {
      return res.status(404).json({ error: "Alumni not found" });
    }

    await db.query(
      "INSERT INTO referral_requests (student_id, alumni_id, message, resume_link) VALUES (?,?,?,?)",
      [req.user.id, alumni_id, message, resume_link || null],
    );

    res.json({ message: "Referral request sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 2) My requests (student: sent ones, alumni: received ones)
router.get("/mine", protect, async (req, res) => {
  try {
    const col = req.user.role === "student" ? "r.student_id" : "r.alumni_id";

    const [rows] = await db.query(
      `SELECT r.id, r.message, r.resume_link, r.status, r.created_at,
              s.name AS student_name, a.name AS alumni_name
       FROM referral_requests r
       JOIN users s ON s.id = r.student_id
       JOIN users a ON a.id = r.alumni_id
       WHERE ${col} = ?
       ORDER BY r.created_at DESC`,
      [req.user.id],
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 3) Alumni updates status
router.patch("/:id", protect, onlyRole("alumni"), async (req, res) => {
  try {
    const { status } = req.body;

    if (!["accepted", "referred", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const [result] = await db.query(
      "UPDATE referral_requests SET status = ? WHERE id = ? AND alumni_id = ?",
      [status, req.params.id, req.user.id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Request not found" });
    }

    res.json({ message: "Status updated" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
