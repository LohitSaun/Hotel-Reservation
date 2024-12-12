const API_URL = "http://localhost:3000"; // Update with your API's base URL

// Fetch room types from the API and populate the dropdown
async function fetchRoomTypes() {
    try {
        const response = await fetch(`${API_URL}/rooms`);
        if (!response.ok) {
            throw new Error("Failed to fetch room types");
        }
        const rooms = await response.json();
        populateRoomTypes(rooms);
    } catch (err) {
        console.error(err);
        alert('Error fetching room types');
    }
}

// Populate the room type dropdown with both ID and Type
function populateRoomTypes(rooms) {
    const roomSelect = document.getElementById('room');
    rooms.forEach(room => {
        const option = document.createElement('option');
        option.value = room.id;  // Use room ID as the option value
        option.textContent = room.type;  // Display room type in the dropdown
        roomSelect.appendChild(option);
    });
}

// Function to handle the form submission
function checkAvailability() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const roomId = document.getElementById('room').value;  // Get the selected room ID
    // const guests = document.getElementById('guests').value;

    if (!checkin || !checkout) {
        alert('Please select check-in and check-out dates.');
        return;
    }

    console.log('Checkin:', checkin);
    console.log('Checkout:', checkout);
    console.log('Room ID:', roomId);
    // console.log('Guests:', guests);

    // Send request to the backend to check availability
    fetch('http://localhost:3000/bookings/checkAvailability', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            room_id: roomId,
            check_in: checkin,
            check_out: checkout,
            // guests: guests
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            // Show error message if no room is available
            console.log("not availableeee")
            // window.location.href = '/room_details.html';
        } else {
            // Show room details if available
            console.log("availableeee")
            window.location.href = "room_details.html?room_id=" + roomId + "&check_in=" + checkin + "&check_out=" + checkout;  // Pass roomId instead of type
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while checking availability.');
    });
}

// Fetch room types when the page loads
fetchRoomTypes();

// Logout functionality
document.getElementById('logout').addEventListener('click', () => {
    // Clear any stored user session or authentication information
    localStorage.removeItem('authToken');
    // Redirect the user to the login page
    window.location.href = 'login.html';
});