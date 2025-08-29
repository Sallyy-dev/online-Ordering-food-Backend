const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const auth = require('../middleware/auth');
const role = require('../middleware/role');
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post("/logout", userController.logout);
router.get('/', auth, role(['admin']), userController.getAllUsers);
router.get('/:id', auth, role(['admin']), userController.getUserById);

module.exports = router;
