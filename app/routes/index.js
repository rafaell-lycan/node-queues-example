const router = require("express").Router();
const appForm = require("./appForm");
const addItems = require("./addItems");
const monitor = require("./monitor");

router.use("/", appForm);
router.use("/add", addItems);
router.use("/", monitor);

module.exports = router;
