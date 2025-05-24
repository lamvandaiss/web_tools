const express = require("express");
const router = express.Router();
const snippetCtrl = require("../controllers/snippet.controller");

router.get("/", snippetCtrl.getAll);
router.post("/", snippetCtrl.create);
router.put("/:id", snippetCtrl.update);
router.delete("/:id", snippetCtrl.remove);

module.exports = router;
