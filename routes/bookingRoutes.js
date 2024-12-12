const express = require('express');
const { getAllBookings, bookRoom, cancelBooking, checkRoomAvailability, updateBooking, getUserBookings} = require('../controllers/bookingController');

const router = express.Router();

router.get('/', getAllBookings);

// Route to book a room
router.post('/book', bookRoom);

router.post('/cancel', cancelBooking);

router.put('/:id', updateBooking);

// Route to check room availability
router.post('/checkAvailability', checkRoomAvailability);

router.get('/bookings', getUserBookings)

module.exports = router;
