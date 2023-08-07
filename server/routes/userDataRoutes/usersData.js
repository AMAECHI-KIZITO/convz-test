const express = require("express");

// Controllers
const usersDataControllers = require("../../controllers/userDataController");

// Middleware
const verifiedJwt = require("../../middlewares/verifyJwt");

const router = express.Router();

router.get("/api/v1/users/", verifiedJwt, usersDataControllers.getAllUsers);
router.get("/api/v1/users/:userId", verifiedJwt, usersDataControllers.getUserDetail);
router.get("/api/v1/dashboard-statistics/", verifiedJwt, usersDataControllers.getDashboardStatistics);

module.exports = router;