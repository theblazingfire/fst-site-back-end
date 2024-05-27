const router = require('express').Router();

const {getUser, addUser} = require('../controllers/auth')

router.get('/login',getUser)

router.post('/signup',addUser) 

module.exports = router