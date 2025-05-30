const express = require("express");
const router = express.Router();
const gencodeCtrl = require("../controllers/gencode.controller");

router.get("/test", gencodeCtrl.runTests);
router.get("/type", gencodeCtrl.runTestType);

module.exports = router;
