const express = require('express');
const { getAllUsers, loginUser, registerUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', getAllUsers);

router.post('/register', registerUser);

// POST /login - Route for user login and JWT token generation
router.post('/login', loginUser);

// Route to delete user by ID
router.delete('/:id', deleteUser);

module.exports = router;
