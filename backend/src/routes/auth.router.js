const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Users = require("../models/user.model");
const db = require("../config/db");
const router = express.Router();

// Middleware validate token
const validateToken = (req, res, next) => {
  const token =
    req.cookies?.auth_token ||
    req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token" });

    req.user = decoded; // { userId, userRole }
    next();
  });
};

router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    phone,
    address,
    role,
  } = req.body;
  //validate
  if (!firstName || !lastName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }
  //function
  try {
    // 1. Check email existing UserExits hiện tại đang [] = User function getByEmail
    const userExists = await Users.getByEmail(email);
    // user esxít [] báo email tồn tại
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 2. Hash password biến hashedPassword 
    const hashedPassword = await bcrypt.hash(password, 10);
    // password đã mã hóa
    const newUser = {
      // random UUID 16 kí tự id hoặc db 1,2,3,4,5,6,7,8,9,... hoặc user01 user02
      id_user: crypto.randomUUID(),
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      phone,
      address,
      role: role === "1" ? "admin" : "user", // schema uses enum("user","admin")
    };

    // 4. Create user using Model
    await Users.create(newUser);

    // 6. Create JWT
    const token = jwt.sign(
      { userId: newUser.id_user, role: newUser.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return res.status(201).json({
      message: "Registration successful",
      userId: newUser.id_user,
      role: newUser.role,
    });
  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing email or password" });

  try {
    const user = await Users.getByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id_user, role: user.role },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    return res.status(200).json({
      message: "Login successful",
      userId: user.id_user,
      role: user.role,
    });
  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/validate-token", validateToken, (req, res) => {
  return res.json({
    valid: true,
    userId: req.user.userId,
    role: req.user.role,
  });
});

router.post("/logout", (req, res) => {
  res.cookie("auth_token", "", { expires: new Date(0) });
  res.json({ message: "Logged out" });
});

module.exports = router;
