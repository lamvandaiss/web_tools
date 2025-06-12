const express = require("express");
const router = express.Router();
const gencodeCtrl = require("../controllers/gencode.controller");

router.post("/be", gencodeCtrl.runBE);
module.exports = router;
