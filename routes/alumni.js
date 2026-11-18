const router = require("express").Router();
const db = require("../db");
const { protect } = require("../middleware/auth");

// GET /api/alumni?company=zoho&skill=react
router.get("/", protect, async (req, res) => {
  try {
    const { company = "", skill = "" } = req.query;

    const [rows] = await db.query(
      `SELECT u.id, u.name, p.company, p.designation, p.department,
              p.batch, p.skills, p.linkedin
       FROM users u
       JOIN profiles p ON p.user_id = u.id
       WHERE u.role = 'alumni'
         AND u.is_verified = TRUE
         AND IFNULL(p.company, '') LIKE ?
         AND IFNULL(p.skills, '') LIKE ?
       ORDER BY u.name`,
      [`%${company}%`, `%${skill}%`],
    );

    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
