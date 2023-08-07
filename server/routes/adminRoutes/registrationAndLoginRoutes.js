const express = require("express");

// Controllers
const adminControllers = require("../../controllers/authentication/auth");

// Middleware
const verifiedJwt = require("../../middlewares/verifyJwt");

const router = express.Router();


router.post("/api/v1/auth/login/", adminControllers.loginAdmin);
router.post("/api/v1/auth/refresh-tokens/", adminControllers.refreshAllTokens);
router.post("/api/v1/auth/signup/", adminControllers.registerAdmin);

module.exports = router;