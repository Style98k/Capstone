import {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  updateUser,
  updateVerificationStatus,
  deleteUser
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

    createUser(name, email, hashed, role || "student", (err2, result) => {
      if (err2) {
        console.error("Error creating user:", err2);
        return res.status(500).json({ message: "Error creating user: " + err2.message });
      }

      // Get the created user ID and generate token
      const userId = result.insertId;
      const token = jwt.sign(
        { id: userId, role: role || "student" },
        "secret123",
        { expiresIn: "7d" }
      );

      return res.status(201).json({ 
        message: "User registered successfully.",
        token,
        user: { id: userId, name, email, role: role || "student" }
      });
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

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    return res.json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  });
};

// Get user by token
export const getProfile = (req, res) => {
  const userId = req.user.id;

  findUserById(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });

    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = results[0];
    res.json(userWithoutPassword);
  });
};

// Get all users (for admin and applicant listings)
export const getUsers = (req, res) => {
  getAllUsers((err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });
    res.json(results);
  });
};

// Get user by ID
export const getUserById = (req, res) => {
  const { id } = req.params;
  
  findUserById(id, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error." });
    
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = results[0];
    res.json(userWithoutPassword);
  });
};

// Update user profile
export const updateUserProfile = (req, res) => {
  const { id } = req.params;
  const data = req.body;
  
  // Ensure user can only update their own profile (unless admin)
  if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
    return res.status(403).json({ message: "Not authorized to update this profile." });
  }
  
  updateUser(id, data, (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating profile." });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    
    // Get updated user data
    findUserById(id, (err2, results) => {
      if (err2) return res.status(500).json({ message: "Database error." });
      
      const { password: _, ...userWithoutPassword } = results[0];
      res.json({ message: "Profile updated successfully.", user: userWithoutPassword });
    });
  });
};

// Update verification status (admin only)
export const updateUserVerification = (req, res) => {
  const { id } = req.params;
  const { field, status } = req.body;
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can update verification status." });
  }
  
  updateVerificationStatus(id, field, status, (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating verification." });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.json({ message: "Verification status updated successfully." });
  });
};

// Delete user (admin only)
export const removeUser = (req, res) => {
  const { id } = req.params;
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Only admins can delete users." });
  }
  
  deleteUser(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting user." });
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found." });
    }
    
    res.json({ message: "User deleted successfully." });
  });
};
