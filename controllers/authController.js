const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db, admin } = require("../config/firebase");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRef = db.collection("users").doc(email);
    await userRef.set({ email, password: hashedPassword });
    res.status(201).send("User registered successfully");
  } catch (error) {
    res.status(500).send("Error registering user");
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(400).send("User not found");

    const isPasswordValid = await bcrypt.compare(password, userDoc.data().password);
    if (!isPasswordValid) return res.status(401).send("Invalid credentials");

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).send("Error logging in");
  }
};

module.exports = { registerUser, loginUser };
