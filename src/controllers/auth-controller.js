import bcrypt from "bcryptjs"

import User from "../models/user-model.js"

import generateToken from "../utils/generate-token.js"

export async function signup(req, res)
{
    try {

        const {
            email,
            password
        } = req.body;

        if (!email || !password)
        {
            return res.status(400).json({
                message: "All fields required"
            })
        }

        const existingUser =
            await User.findOne({ email });

        if (existingUser)
        {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword =
            await bcrypt.hash(password, 10);

        const user =
            await User.create({
                email,
                password: hashedPassword
            })

        const token =
            generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(201).json({
            message: "Signup successful",
            data: {
                _id: user._id,
                email: user.email
            }
        })
    }
    catch(err) {

        return res.status(500).json({
            message: err.message
        })
    }
}

export async function login(req, res)
{
    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({ email });

        if (!user)
        {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            )

        if (!isMatch)
        {
            return res.status(400).json({
                message: "Invalid credentials"
            })
        }

        const token =
            generateToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({
            message: "Login successful",
            data: {
                _id: user._id,
                email: user.email
            }
        })
    }
    catch(err) {

        return res.status(500).json({
            message: err.message
        })
    }
}

export async function me(req, res)
{
    try {
        const user = req.user;

        return res.status(200).json({
            data: user
        })
    }
    catch(err) {

        return res.status(500).json({
            message: err.message
        })
    }
}

export async function logout(req, res)
{
    res.clearCookie("token");

    return res.status(200).json({
        message: "Logged out"
    })
}