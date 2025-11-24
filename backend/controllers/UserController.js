import { createUser, findUserByEmail } from "../models/usermodel.js";

// USER REGISTRATION
export const registerUser = (req, res) => {
  const { name, email, password, role } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Check if email already exists
  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // If email not taken → create user
    createUser(name, email, password, role || "student", (err2, result) => {
      if (err2) return res.status(500).json({ message: "Failed to create user." });

      return res.status(201).json({ message: "User registered successfully." });
    });
  });
};

// USER LOGIN
export const loginUser = (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if (!email || !password) {
    return res.status(400).json({ message: "Missing login fields." });
  }

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const user = results[0];

    // NOTE: WALANG HASHING MUNA (BEGINNER MODE)
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
};
