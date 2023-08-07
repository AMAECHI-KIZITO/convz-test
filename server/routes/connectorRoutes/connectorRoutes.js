const express = require("express");

// Controllers
const connectorControllers = require("../../controllers/connectorController");

// Middleware
const verifiedJwt = require("../../middlewares/verifyJwt");

const router = express.Router();

router.post("/api/v1/new-connector/", verifiedJwt, connectorControllers.createConnector);
router.post("/api/v1/delete-connector/", verifiedJwt, connectorControllers.deleteConnector);
router.get("/api/v1/connectors/:userId", verifiedJwt, connectorControllers.getUserConnectors);

module.exports = router;