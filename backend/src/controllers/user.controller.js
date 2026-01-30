import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import {
  uploadToCloudinary,
  destroyFromCloudinary,
} from "../utils/cloudinaryService.js";

/* ============================
   🟢 PUBLIC CONTROLLER
============================ */

export const getPublicUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("name avatar role createdAt")
      .lean();

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* ============================
   🔒 ADMIN CONTROLLERS
============================ */

/* GET ALL USERS */
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role,
    } = req.query;

    const query = {};

    if (role) query.role = role;

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* GET USER BY ID */
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* CREATE USER */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    let avatar = null;
    if (req.files?.avatar?.[0]) {
      const up = await uploadToCloudinary(
        req.files.avatar[0].path,
        "users/avatar"
      );
      avatar = up.secure_url;
    }

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "customer",
      avatar,
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* FULL UPDATE (PUT) */
export const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const { name, email, password, role } = req.body;

    if (password?.trim()) {
      user.password = await bcrypt.hash(password, 10);
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email;
    if (role !== undefined) user.role = role;

    if (req.files?.avatar?.[0]) {
      if (user.avatar) {
        const id = user.avatar.split("/").pop().split(".")[0];
        await destroyFromCloudinary(`users/avatar/${id}`);
      }

      const up = await uploadToCloudinary(
        req.files.avatar[0].path,
        "users/avatar"
      );
      user.avatar = up.secure_url;
    }

    await user.save();
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* PARTIAL UPDATE (PATCH) */
export const partiallyUpdateUser = async (req, res) => {
  try {
    const allowed = ["name", "email", "role", "avatar"];

    const updates = {};
    Object.entries(req.body).forEach(([k, v]) => {
      if (allowed.includes(k)) updates[k] = v;
    });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true, select: "-password" }
    );

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* DELETE USER */
export const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.avatar) {
      const id = user.avatar.split("/").pop().split(".")[0];
      await destroyFromCloudinary(`users/avatar/${id}`);
    }

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};




/* ===========================
   🔒 GET LOGGED-IN USER
   GET /users/me
=========================== */
export const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove sensitive fields if needed
    const safeUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.json({
      success: true,
      data: safeUser,
    });
  } catch (error) {
    console.error("GET /users/me error:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
