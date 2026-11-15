import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters."
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        });

        res.status(201).json({
            success: true,
            message: "Registration successful."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({
            email: email?.toLowerCase()
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getMe = async (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
};