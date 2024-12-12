const db = require('../db/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const getAllUsers = (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
};

const registerUser = (req, res) => {
    const { email, password, name } = req.body;

    // Ensure role is set to 'customer' by default
    const role = 'customer';

    // Hash the password before saving to the database
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Store the user with the hashed password
        const query = 'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)';
        db.query(query, [email, hashedPassword, name, role], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({ message: 'User registered successfully' });
        });
    });
};

const loginUser = (req, res) => {
    const { email, password } = req.body; // Assuming you're using email to authenticate

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = results[0];

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ error: 'Error comparing passwords' });
            }

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            // If passwords match, proceed with generating a JWT token or other login logic
            const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, 'your_secret_key', { expiresIn: '1h' });
            return res.json({ message: 'Login successful', token, role: user.role});
        });
    });
};

const deleteUser = (req, res) => {
    const userId = req.params.id;

    // Start a transaction to ensure both the user and their bookings are deleted atomically
    db.beginTransaction((err) => {
        if (err) {
            return res.status(500).json({ error: 'Error starting transaction' });
        }

        // First, delete the bookings associated with the user
        const deleteBookingsQuery = 'DELETE FROM bookings WHERE user_id = ?';
        db.query(deleteBookingsQuery, [userId], (err, results) => {
            if (err) {
                return db.rollback(() => {
                    return res.status(500).json({ error: 'Error deleting bookings' });
                });
            }

            // After deleting bookings, now delete the user
            const deleteUserQuery = 'DELETE FROM users WHERE id = ?';
            db.query(deleteUserQuery, [userId], (err, results) => {
                if (err) {
                    return db.rollback(() => {
                        return res.status(500).json({ error: 'Error deleting user' });
                    });
                }

                // Commit the transaction if both queries were successful
                db.commit((err) => {
                    if (err) {
                        return db.rollback(() => {
                            return res.status(500).json({ error: 'Error committing transaction' });
                        });
                    }

                    res.status(200).json({ message: 'User and their bookings deleted successfully' });
                });
            });
        });
    });
};


module.exports = { getAllUsers, loginUser, registerUser, deleteUser };
