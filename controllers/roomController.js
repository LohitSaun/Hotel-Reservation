const db = require('../db/db');

const getAllRooms = (req, res) => {
    db.query('SELECT * FROM rooms', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            console.log('Get room endpoint hit:', req.body);
            res.json(results);
        }
    });
};

const getRoomById = (req, res) => {
    const { id } = req.params;
  
    // Check if the room exists before trying to fetch
    const checkRoomQuery = `SELECT * FROM rooms WHERE id = ?`;
    db.query(checkRoomQuery, [id], (err, results) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'Room not found' });
      }
  
      // Return the room data
      res.status(200).json(results[0]);
    });
  };

const addRoom = (req, res) => {
    const { type, amenities, price, availability } = req.body;

    // Ensure availability is treated as a boolean
    console.log('availability:', availability);
    const isAvailable = availability === undefined ? true : Boolean(availability);

    const query = `INSERT INTO rooms (type, amenities, price, availability) VALUES (?, ?, ?, ?)`;
    db.query(query, [type, amenities, price, isAvailable], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Room added successfully', roomId: results.insertId });
    });
};

const editRoom = (req, res) => {
    const { id } = req.params; // Get room ID from URL parameters
    const { type, price, amenities, availability } = req.body; // Get updated data from request body

    // Check if the room exists before updating
    const checkRoomQuery = `SELECT * FROM rooms WHERE id = ?`;
    db.query(checkRoomQuery, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Update the room with new information
        const updateQuery = `
            UPDATE rooms 
            SET type = ?, price = ?, amenities = ?, availability = ? 
            WHERE id = ?`;

        // Serialize amenities if it is an array
        const amenitiesString = Array.isArray(amenities) ? amenities.join(', ') : amenities;

        db.query(updateQuery, [type, price, amenitiesString, availability, id], (err, result) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: `Room with ID ${id} updated successfully` });
        });
    });
};




const deleteRoom = (req, res) => {
    const { id } = req.params;  // Get room ID from URL parameters

    // Check if the room exists before trying to delete
    const checkRoomQuery = `SELECT * FROM rooms WHERE id = ?`;
    db.query(checkRoomQuery, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // Delete the room
        const deleteQuery = `DELETE FROM rooms WHERE id = ?`;
        db.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error('Database error:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: `Room with ID ${id} deleted successfully` });
        });
    });
};

module.exports = { addRoom, getAllRooms, deleteRoom, getRoomById, editRoom };
