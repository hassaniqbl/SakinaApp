const express = require("express");

const router = express.Router();

const admCodeRoutes = require("../modules/adm-code/adm-code.routes");

router.use("/", admCodeRoutes);

module.exports = router;


