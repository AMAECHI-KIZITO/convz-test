const express = require("express");

// Controllers
const reportControllers = require("../../controllers/reportController");

// Middleware
const verifiedJwt = require("../../middlewares/verifyJwt");

const router = express.Router();

router.post("/api/v1/new-report/", verifiedJwt, reportControllers.createReport);
router.post("/api/v1/delete-report/", verifiedJwt, reportControllers.deleteReport);
router.get("/api/v1/reports/:userId", verifiedJwt, reportControllers.getUserReports);

module.exports = router;