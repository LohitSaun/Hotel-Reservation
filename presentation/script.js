const API_URL = "http://localhost:3000";

// let token = "";

// Login Function
document.getElementById("loginBtn").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Please enter both email and password");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {

            // token = data.token;

             // Store the token in the browser's local storage
            localStorage.setItem("authToken", data.token);

            const userRole = data.role; // Assuming the role is part of the login response

            if (userRole === "customer") {
                // Redirect to newHome.html if the user is a customer
                window.location.href = "newHome.html";
            } else {
                 // Redirect to adminHome.html if the user is a customer
                 window.location.href = "admin/adminHome.html";
            }
        } else {
            alert(data.error || "Login failed");
        }
    } catch (err) {
        console.error(err);
        alert("Error during login");
    }
});


// Fetch Rooms
async function fetchRooms() {
    try {
        const response = await fetch(`${API_URL}/rooms`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch rooms");
        }

        const rooms = await response.json();
        displayRooms(rooms);
    } catch (err) {
        console.error(err);
        alert(err.message || "Failed to fetch rooms");
    }
}

// Display Rooms
function displayRooms(rooms) {
    const roomsList = document.getElementById("roomsList");
    roomsList.innerHTML = "";

    rooms.forEach((room) => {
        const div = document.createElement("div");
        div.classList.add("room");
        div.innerHTML = `
            <span>${room.type} - $${room.price} (${room.availability ? "Available" : "Not Available"})</span>
            <button onclick="deleteRoom(${room.id})">Delete</button>
        `;
        roomsList.appendChild(div);
    });
}

// Add Room
document.getElementById("addRoomBtn").addEventListener("click", async () => {
    const type = document.getElementById("roomType").value;
    const amenities = document.getElementById("amenities").value;
    const price = document.getElementById("price").value;
    const availability = document.getElementById("availability").checked;

    if (!type || !amenities || !price) {
        alert("Please fill in all fields");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ type, amenities, price, availability }),
        });

        const data = await response.json();
        if (response.ok) {
            alert("Room added successfully");
            fetchRooms();
        } else {
            alert(data.error || "Failed to add room");
        }
    } catch (err) {
        console.error(err);
        alert("Error adding room");
    }
});

// Delete Room
async function deleteRoom(id) {
    try {
        const response = await fetch(`${API_URL}/rooms/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
            alert("Room deleted successfully");
            fetchRooms();
        } else {
            alert(data.error || "Failed to delete room");
        }
    } catch (err) {
        console.error(err);
        alert("Error deleting room");
    }
}

// Toggle Add Room Form
document.getElementById("showAddRoomForm").addEventListener("click", () => {
    const form = document.getElementById("addRoomForm");
    form.style.display = form.style.display === "none" ? "block" : "none";
});
