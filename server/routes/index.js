const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const usersRoutes = require("./users.routes");
const patientsRoutes = require("./patients.routes");
const deliveriesRoutes = require("./deliveries.routes");
const anemiaCheckupsRoutes = require("./anemia-checkups.routes");
const anemiaPerformaRoutes = require("./anemia-performa.routes");
const sixWeekRoutes = require("./six-week-checkups.routes");
const annualCheckupsRoutes = require("./annual-checkups.routes");

const admCodeItemRoutes = require("./adm-code-item.routes");
const admCodeRoutes = require("./adm-code.routes");

router.use(authRoutes);
router.use(usersRoutes);
router.use(patientsRoutes);
router.use(deliveriesRoutes);
router.use(anemiaCheckupsRoutes);
router.use(anemiaPerformaRoutes);
router.use(sixWeekRoutes);
router.use(annualCheckupsRoutes);
router.use(admCodeRoutes);
router.use(admCodeItemRoutes);


module.exports = router;

