import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../models/usermodel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register new user
export const register = (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  // Check if email exists
  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered." });
    }

    // Hash password
    const hashed = bcrypt.hashSync(password, 10);

    createUser(name, email, hashed, role || "student", (err2) => {
      if (err2) return res.status(500).json({ message: "Error creating user." });

      return res.status(201).json({ message: "User registered successfully." });
    });
  });
};

// Login user
export const login = (req, res) => {
  const { email, password } = req.body;

  findUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const user = results[0];

    // Check password
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "secret123", // CHANGE THIS LATER
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  });
};

// Get user by token
export const getProfile = (req, res) => {
  const userId = req.user.id;

  findUserById(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    res.json(results[0]);
  });
};
