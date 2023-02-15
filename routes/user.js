const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const userController = require("../controllers/user");
const { ensureAuth } = require("../middleware/auth");

router.get("/:id", ensureAuth, userController.getUser);

module.exports = router;
