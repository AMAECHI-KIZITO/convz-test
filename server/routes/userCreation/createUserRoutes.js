const express = require("express");

// Controllers
const userCreationControllers = require("../../controllers/userCreation");

// Middleware
const verifiedJwt = require("../../middlewares/verifyJwt");

const router = express.Router();

router.post("/api/v1/register-user/", verifiedJwt, userCreationControllers.createUser);
router.post("/api/v1/update-user/", verifiedJwt, userCreationControllers.updateUser);
router.get("/api/v1/user/verify/:id/:token", userCreationControllers.verifyUserAccount);

module.exports = router;