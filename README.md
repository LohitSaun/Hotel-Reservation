Hotel Reservation System

This is a Hotel Reservation System built with Node.js, Express, MySQL, and other technologies. The system allows users to register, log in, book rooms, and manage bookings. An admin can set up the admin account and manage the system.

Prerequisites
Before you start, make sure you have the following installed:

Node.js (>= 14.x)
MySQL (>= 5.7)
A MySQL database named hotelreservationsystem with the following tables:
users
rooms
bookings

Installation

Install dependencies:
npm install

Configure environment variables:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=hotelreservationsystem
JWT_SECRET=your_secret_key
PORT=3000


Set up the database:
CREATE DATABASE hotelreservationsystem;

USE hotelreservationsystem;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  amenities TEXT,
  availability TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

Running the Application

Start the server:
npm start or node server.js

Access the following routes:
/setup-admin - To create an admin user (POST request).
/users/register - To register a new user (POST request).
/users/login - To log in a user (POST request).

Example API Requests

Create an Admin:

POST request to /setup-admin with JSON body:
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123"
}

