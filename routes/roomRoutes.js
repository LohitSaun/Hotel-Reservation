const express = require('express');
const { getAllRooms, addRoom, deleteRoom, getRoomById, editRoom } = require('../controllers/roomController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');  // Import JWT middlewares


const router = express.Router();


router.get('/', getAllRooms);

router.get('/:id', getRoomById);

router.post('/',verifyToken, isAdmin, addRoom);

router.post('/edit/:id', editRoom);

// DELETE /rooms/:id (ID of the room to delete)
router.delete('/:id',verifyToken, isAdmin, deleteRoom);

module.exports = router;
