const db = require('../db/db');
const bcrypt = require('bcryptjs');

const setupAdmin = (req, res) => {
    const { email, password, name } = req.body;

    // Hash the admin password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Check if an admin already exists
        const checkAdminQuery = 'SELECT * FROM users WHERE role = "admin" LIMIT 1';
        db.query(checkAdminQuery, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Error checking admin existence' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'Admin already exists' });
            }

            // Create the admin user if no admin exists
            const insertAdminQuery = 'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)';
            db.query(insertAdminQuery, [email, hashedPassword, name, 'admin'], (err, results) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(201).json({ message: 'Admin user created successfully' });
            });
        });
    });
};

module.exports = { setupAdmin };
