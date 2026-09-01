const express = require("express");
const router = express.Router();

const {
    admin_login, admin_logout, sendOtpTOadmin, verifyOtp, admin_forgatePassword
} = require("../controllers/adminValidation");

const user_auth = require("../middleware/authMiddleware");

router.post("/admin_login", admin_login);
router.post("/admin_logout", user_auth.protect, admin_logout);
router.post("/sendOtpTOadmin", sendOtpTOadmin);
router.post("/verifyOtp", verifyOtp);
router.post("/admin_forgatePassword", admin_forgatePassword);

module.exports = router;
