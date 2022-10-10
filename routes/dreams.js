const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer");
const dreamsController = require('../controllers/dreams');
const { ensureAuth, ensureGuest } = require('../middleware/auth');

// router.get('/', ensureAuth, todosController.getTodos)

router.get('/', ensureAuth, dreamsController.getDreams)

router.get('/dreamland', dreamsController.getDreamLand)

router.get('/dreamForm', ensureAuth, dreamsController.getDreamForm)

router.get('/fullDream/:id', ensureGuest, dreamsController.getFullDream)

router.post('/add', ensureAuth, upload.single("file"), dreamsController.postDream)

router.get('/edit/:id', ensureAuth, dreamsController.getEdit)

router.put('/edit/:id', ensureAuth, dreamsController.editDream)

router.delete('/delete/:id', ensureAuth, dreamsController.deleteDream)

module.exports = router