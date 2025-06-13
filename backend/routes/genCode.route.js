const express = require("express");
const router = express.Router();
const gencodeCtrl = require("../controllers/gencode.controller");

router.post("/be", gencodeCtrl.runBE);
router.get("/download/:projectName", gencodeCtrl.downloadProject);
module.exports = router;
