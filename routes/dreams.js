const express = require('express')
const router = express.Router()
const dreamsController = require('../controllers/dreams')
    // const { ensureAuth, ensureGuest } = require('../middleware/auth')

// router.get('/', ensureAuth, todosController.getTodos)

router.get('/', dreamsController.getDreams)

router.get('/dreamForm', dreamsController.getDreamForm)

router.get('/fullDream/:id', dreamsController.getFullDream)

router.post('/add', dreamsController.postDream)

// router.put('/dreams', dreamsController.editDreams)

router.delete('/delete', dreamsController.deleteDream)

module.exports = router