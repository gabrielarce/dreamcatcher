const express = require('express')
const router = express.Router()
const dreamsController = require('../controllers/dreams')
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// router.get('/', ensureAuth, todosController.getTodos)

router.get('/', ensureAuth, dreamsController.getDreams)

router.get('/dreamForm', ensureAuth, dreamsController.getDreamForm)

router.get('/fullDream/:id', ensureAuth, dreamsController.getFullDream)

router.post('/add', ensureAuth, dreamsController.postDream)

router.get('/edit/:id', ensureAuth, dreamsController.getEdit)

router.put('/edit/:id', ensureAuth, dreamsController.editDream)

router.delete('/delete', ensureAuth, dreamsController.deleteDream)

module.exports = router