const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// ✅ Signup route
app.post("/signup", (req, res) => {
  const { name, email } = req.body;
  console.log("Received signup:", name, email);

  if (!name || !email) {
    return res.status(400).json({ message: "Missing name or email" });
  }

  const dataFile = "results.json";
  let existingData = [];

  if (fs.existsSync(dataFile)) {
    existingData = JSON.parse(fs.readFileSync(dataFile));
  }

  // check if email already exists
  if (existingData.find(u => u.email === email)) {
    return res.status(400).json({ message: "Email already signed up!" });
  }

  existingData.push({ name, email });
  fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));

  res.json({ message: "Signup successful!" });
});

// ✅ Save quiz result
app.post("/save-result", (req, res) => {
  const { email, result } = req.body;

  const dataFile = "results.json";
  let existingData = [];

  if (fs.existsSync(dataFile)) {
    existingData = JSON.parse(fs.readFileSync(dataFile));
  }

  const user = existingData.find(u => u.email === email);
  if (user) {
    user.result = result;
  }

  fs.writeFileSync(dataFile, JSON.stringify(existingData, null, 2));
  res.json({ message: "Result saved successfully!" });
});

// ✅ Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
