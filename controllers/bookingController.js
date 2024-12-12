const db = require('../db/db');

const getAllBookings = (req, res) => {
    db.query(' SELECT  bookings.id,  users.name AS user_name, bookings.user_id, bookings.room_id, bookings.check_in,  bookings.check_out,  bookings.status FROM   bookings  JOIN    users  ON   bookings.user_id = users.id;', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
};

const getUserBookings = (req, res) => {
    const { user_id } = req.query;

    // Make sure the user_id is provided
    if (!user_id) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Query to fetch bookings for the specific user, including room type
    const query = `
        SELECT 
            bookings.id, 
            users.name AS user_name, 
            bookings.user_id, 
            bookings.room_id, 
            bookings.check_in, 
            bookings.check_out, 
            bookings.status,
            rooms.type AS room_type  -- Added room type
        FROM bookings
        JOIN users ON bookings.user_id = users.id
        JOIN rooms ON bookings.room_id = rooms.id  -- Join with rooms table
        WHERE bookings.user_id = ?
    `;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else {
            res.json(results); // Return the results with room type
        }
    });
};


// Function to check room availability
const checkRoomAvailability = (req, res) => {
    console.log("checkRoomAvailability called");

    const { room_id, check_in, check_out } = req.body;

    // Validate input
    if (!room_id || !check_in || !check_out) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the room is available for the specified dates
    const availabilityQuery = `
        SELECT * FROM bookings
        WHERE room_id = ? AND 
        (check_in <= ? AND check_out >= ?)
    `;

    db.query(availabilityQuery, [room_id, check_out, check_in], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            return res.status(200).json({ error: 'Room is already booked for the selected dates' });
        }

        // Room is available
        return res.status(200).json({ message: 'Room is available' });
    });
};

// Function to handle booking a room
const bookRoom = (req, res) => {

    console.log("bookRoom called");

    const { user_id, room_id, check_in, check_out } = req.body;

    
    // Validate input
    if (!user_id || !room_id || !check_in || !check_out) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the room is available for the specified dates
    const availabilityQuery = `
        SELECT * FROM bookings
        WHERE room_id = ? AND 
        (check_in <= ? AND check_out >= ?)
    `;

    db.query(availabilityQuery, [room_id, check_out, check_in], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            return res.status(400).json({ error: 'Room is already booked for the selected dates' });
        }

        // Insert the booking
        const insertBookingQuery = `
            INSERT INTO bookings (user_id, room_id, check_in, check_out, status)
            VALUES (?, ?, ?, ?, 'confirmed')
        `;
        db.query(insertBookingQuery, [user_id, room_id, check_in, check_out], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Room booked successfully', bookingId: result.insertId });
        });
    });
};

const cancelBooking = (req, res) => {
    const { booking_id } = req.body;

    if (!booking_id) {
        return res.status(400).json({ error: 'Booking ID is required' });
    }

    const query = `DELETE FROM bookings WHERE id = ?`;

    db.query(query, [booking_id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Booking canceled successfully' });
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    });
};

const updateBooking = (req, res) => {
    const { id } = req.params;
    const { user_id, room_id, check_in, check_out } = req.body;

    // Validate input
    if (!id || !user_id || !room_id || !check_in || !check_out) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const updateQuery = `
        UPDATE bookings
        SET user_id = ?, room_id = ?, check_in = ?, check_out = ?
        WHERE id = ?
    `;

    db.query(updateQuery, [user_id, room_id, check_in, check_out, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Booking updated successfully' });
        } else {
            res.status(404).json({ error: 'Booking not found' });
        }
    });
};


module.exports = { getAllBookings, bookRoom, cancelBooking, checkRoomAvailability, updateBooking, getUserBookings };

