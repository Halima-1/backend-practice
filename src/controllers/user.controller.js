import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";
import dotenv from "dotenv"
import { generateTOken } from "../utils/generateToken.js";

dotenv.config({
    path: "./.env"
})
const registerUser = async (req, res) => {
    const session = await mongoose.startSession()
    session.startTransaction()
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        const existing = await User.findOne({ email: email.toLowerCase() })
        if (existing) {
            // return res.status(400).json({ message: "User already exist" })
            const error = new Error("User already exist");
            error.statusCode = 409
            throw error

        }

        // password is hashed automatically by the pre("save") hook in the model
        const newUser = await User.create({
            username,
            email: email.toLowerCase(),
            password
        })

        // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES || "7d" })

        await session.commitTransaction()
        session.endSession()

        // Generate JWT
        const token = generateTOken(newUser.id, res)
        res.status(201).json({
            message: "user registered",
            token,
            user: { id: newUser._id, email: newUser.email, username: newUser.username }
        })

    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        res.status(error.statusCode || 500).json({ message: "internal error", error: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email: email.toLowerCase()
        })

        if (!user) {
            return res.status(400).json({
                message: "user not found"
            });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({
            message: "Invalid credentials"
        })

        // Generate JWT
        const token = generateTOken(user.id, res)
        res.status(200).json({
            status: "Success",
            message: "User logged in!",
            user: {
                id: user._id,
                email: user.email,
                username: user.username
            }, token
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error", error: error.message
        })
    }
}

const logout = async (req, res) => {
    res.cookie("jwt", "",
        {
            httpOnly: true,
            expires: new Date(0),
        }
    )
    res.status(200).json({
        status: "Success",
        message: "Logged out successfully"
    })
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 })

        res.status(200).json({
            message: "users fetched successfully",
            count: users.length,
            users
        })
    } catch (error) {
        res.status(500).json({ message: "Internal error", error: error.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await User.findById(id)

        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        res.status(200).json({
            message: "User fetched successfully",
            user
        })

    } catch (error) {
        res.status(500).json({ message: "Internal error", error: error.message })
    }
}

export { registerUser, login, logout, getUsers, getUserById }