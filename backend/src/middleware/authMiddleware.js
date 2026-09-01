const jwt = require("jsonwebtoken");
const admin_model = require("../models/adminModel");

exports.protect = async (req, res, next) => {
    try {
        let token;
        
        // Try getting token from cookies first
        if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        } 
        // Then try fallback to Authorization header
        else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, no token provided",
            });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY || "itisthesecretkeyforhealthandfitnesstrackerapp");
        const admin = await admin_model.findById(decoded.id);

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, admin not found",
            });
        }

        // Optional: Verify that token matches stored auth_key
        if (admin.auth_key !== token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized, session expired or invalid",
            });
        }

        req.user = admin;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Not authorized, invalid token",
        });
    }
};
