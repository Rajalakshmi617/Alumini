const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/alumni", require("./routes/alumni"));
app.use("/api/referrals", require("./routes/referrals"));
app.use("/api/slots", require("./routes/slots"));

app.get("/", (req, res) => {
  res.send("Alumni Connect server is running 🚀");
});
db.query("SELECT 1")
  .then(() => console.log("MySQL connected ✅"))
  .catch((err) => console.log("MySQL error ❌", err.message));

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
