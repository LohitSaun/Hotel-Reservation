const express = require('express');
const { setupAdmin } = require('../controllers/adminController');

const router = express.Router();

// Route to create the admin user
router.post('/setup', setupAdmin);

module.exports = router;
