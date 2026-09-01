const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const admin_model = require("../models/adminModel");
const axios = require("axios");

const sendOTP = async (email, otp) => {
    const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
            sender: { email: "rizeworldcode@gmail.com", name: "RizeWorld" },
            to: [{ email: email }],
            subject: "Password Reset Verification Code",
            textContent: `Dear User,
Your verification code is: ${otp}
This code is valid for 10 minutes.
If you did not request a password reset, please ignore this email.
Thank you, RizeWorld Team`,
        },
        {
            headers: {
                "api-key": process.env.BREVO_API_KEY,
                "Content-Type": "application/json",
            },
        }
    );
    return response.data;
};

exports.admin_login = async (req, res) => {
    try {
        const { frontend_password, frontend_email } = req.body;

        if (!frontend_email || !frontend_password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // First check if admin exists in DB
        let existingAdmin = await admin_model.findOne({ email: frontend_email });

        // If no admin exists in DB at all, auto-create initial admin account
        const totalAdmins = await admin_model.countDocuments();
        if (!existingAdmin && totalAdmins === 0) {
            const hashedPassword = await bcrypt.hash(frontend_password, 10);
            existingAdmin = await admin_model.create({
                email: frontend_email,
                password: hashedPassword
            });
        }

        if (!existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Check password against DB
        const isPasswordValid = await bcrypt.compare(frontend_password, existingAdmin.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign({ id: existingAdmin._id, role: "admin" }, process.env.SECRET_KEY || "itisthesecretkeyforhealthandfitnesstrackerapp");
        if (!token) {
            return res.status(500).json({ success: false, message: "Token generation failed" });
        }
        
        // Set the token to cookies
        res.cookie("token", token);
        const authKeyInsertion = await admin_model.findOneAndUpdate(
            { _id: existingAdmin._id },
            { auth_key: token },
            { new: true }
        );

        if (!authKeyInsertion) {
            return res.status(500).json({ success: false, message: "Token updation failed" });
        }

        return res.status(200).json({
            message: "User logged in successfully",
            success: true,
            token: token,
            userId: existingAdmin._id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "Internal server error",
            success: false,
        });
    }
};

exports.sendOtpTOadmin = async (req, res) => {
    const { email } = req.body;

    try {
        const AdminData = await admin_model.findOne({ email: email });

        if (!AdminData) {
            return res.status(404).json({
                message: "Admin not found with this email",
                success: false,
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = Date.now() + 3600000; // 1 hour

        // Update admin with OTP
        const update_admin = await admin_model.findOneAndUpdate({ email: email },
            {
                $set: {
                    otp: otp,
                    otpExpiry: otpExpiry
                }
            },
            { new: true }
        );

        if (!update_admin) {
            return res.status(500).json({
                message: "admin not found",
                success: false,
            });
        }

        const otp_send = await sendOTP(email, otp);
        if (!otp_send) {
            return res.status(500).json({
                message: "otp send failed",
                success: false,
            });
        }

        return res.status(200).json({
            message: "OTP send successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || error,
            success: false,
        });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    console.log(typeof otp);
    try {
        const user = await admin_model.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Invalid email",
                success: false,
            });
        }
        console.log(typeof user.otp);
        if (user.otp !== otp || otp == undefined || user.otpExpiry < Date.now()) {
            return res.status(400).json({
                message: "Invalid or expired OTP",
                success: false,
            });
        }

        const token = jwt.sign({ id: user._id, role: "admin" }, process.env.SECRET_KEY || "itisthesecretkeyforhealthandfitnesstrackerapp");
        if (!token) {
            return res.status(500).json({
                message: "Token generation failed",
                success: false,
            });
        }
        res.cookie("token", token);
        const update_admin = await admin_model.findOneAndUpdate({ email: email },
            {
                $set: {
                    auth_key: token,
                }
            },
            { new: true }
        );

        if (!update_admin) {
            return res.status(500).json({
                message: "password updation failed",
                success: false,
            });
        }
        return res.status(200).json({
            token,
            message: "OTP verified successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: error.message || "An error occurred",
            success: false,
        });
    }
};

exports.admin_forgatePassword = async (req, res) => {
    const { newPassword, email } = req.body;
    console.log(newPassword, email);

    try {
        if (!newPassword || !email) {
            return res.status(400).json({
                message: "email or password not defined",
                success: false
            });
        }
        const existingAdmin = await admin_model.findOne({ email }).select('+auth_key');
        if (!existingAdmin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        console.log(existingAdmin.auth_key);

        if (existingAdmin.auth_key) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();

            return res.status(200).json({
                success: true,
                message: "Password updated successfully",
            });
        }
        return res.status(400).json({
            success: false,
            message: "try again",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

exports.admin_logout = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        // Remove auth_key from the admin record so the token can't be reused
        try {
            await admin_model.findByIdAndUpdate(req.user._id, { $unset: { auth_key: "" } });
        } catch (dbErr) {
            console.log('Failed to remove auth_key on logout:', dbErr);
        }

        // Invalidate the token
        res.clearCookie("token");
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
