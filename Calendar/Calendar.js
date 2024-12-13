const monthDisplay = document.getElementById('calendarMonth');
const calendarBody = document.getElementById('calendarBody');
const upcomingEventsSection = document.getElementById('upcomingEvents');
let currentMonth = new Date();
let events = JSON.parse(localStorage.getItem('events')) || {};

// Function to display the days of the current month
function displayMonth() {
    calendarBody.innerHTML = ''; // Clear previous calendar cells

    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthDisplay.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let day = 1;
    let rowCount = Math.ceil((firstDay + daysInMonth) / 7);

    for (let i = 0; i < rowCount; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            cell.className = 'calendarCell';

            if (i === 0 && j < firstDay) {
                cell.textContent = '';
            } else if (day > daysInMonth) {
                cell.textContent = '';
            } else {
                // Add the day number
                cell.textContent = day;
                const dateKey = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                cell.setAttribute('data-date', dateKey);

                // If there are events on this date, display them
                if (Array.isArray(events[dateKey])) {
                    events[dateKey].forEach(event => {
                        const eventDiv = document.createElement('div');
                        eventDiv.className = 'eventText';
                        eventDiv.textContent = event.text;
                        eventDiv.style.backgroundColor = event.color;
                        cell.appendChild(eventDiv);
                    });
                }

                // Add click event to open the modal with the selected date
                cell.addEventListener('click', () => openModal(dateKey));

                day++;
            }
            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

// Modal and form elements
const modal = document.getElementById("eventModal");
const span = document.getElementsByClassName("close")[0];
const eventDate = document.getElementById("eventDate");
const eventText = document.getElementById("eventText");
const eventColor = document.getElementById("eventColor");
const eventTime = document.getElementById("eventTime"); // Time field
const eventLocation = document.getElementById("eventLocation"); // Location field
let deleteButtons = [];

function openModal(dateKey) {
    eventDate.value = dateKey;
    eventText.value = ''; // Clear the text field
    eventColor.value = ''; // Clear the color field
    eventTime.value = ''; // Clear the time field
    eventLocation.value = ''; // Clear the location field
    modal.style.display = "block";

    // Clear previous event displays and delete buttons
    clearPreviousEvents();

    const modalContent = modal.querySelector('.modal-content');
    // If there are events on this date, add delete buttons for each event
    if (Array.isArray(events[dateKey]) && events[dateKey].length > 0) {
        events[dateKey].forEach((event, index) => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'eventText';
            eventDiv.textContent = event.text;
            eventDiv.style.backgroundColor = event.color;

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete Event';
            deleteButton.className = 'deleteButton';
            deleteButton.onclick = () => deleteEvent(dateKey, index);
            deleteButton.style.float = 'right'; // Float the delete button to the right
            eventDiv.appendChild(deleteButton);

            modalContent.appendChild(eventDiv);
            deleteButtons.push(eventDiv); // Track the delete buttons for removal later
        });
    }
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Function to add an event to the selected date
function addEvent() {
    const date = eventDate.value;
    const text = eventText.value;
    const color = eventColor.value;
    const time = eventTime.value; // Capture time
    const location = eventLocation.value; // Capture location

    if (date && text && color) {
        if (!Array.isArray(events[date])) {
            events[date] = [];
        }
        events[date].push({ text, color, time, location }); // Store time and location in the event
        localStorage.setItem('events', JSON.stringify(events)); // Save events to localStorage
        displayMonth(); // Refresh the calendar to show the event
        modal.style.display = "none"; // Close the modal
    }
}

// Function to delete an event from the selected date
function deleteEvent(date, eventIndex) {
    if (Array.isArray(events[date])) {
        events[date].splice(eventIndex, 1); // Remove event from the events array
        if (events[date].length === 0) {
            delete events[date]; // Remove the date key if no events left
        }
        localStorage.setItem('events', JSON.stringify(events)); // Update localStorage
        displayMonth(); // Refresh the calendar to remove the event
        clearPreviousEvents();
        openModal(date); // Reopen the modal to refresh event displays
    }
}

// Function to clear previous event displays and delete buttons in the modal
function clearPreviousEvents() {
    deleteButtons.forEach(button => button.remove());
    deleteButtons = [];
}

// Function to change the month
function changeMonth(offset) {
    currentMonth.setMonth(currentMonth.getMonth() + offset);
    displayMonth();
}

// Display upcoming events with time and location
function displayUpcomingEvents() {
    upcomingEventsSection.innerHTML = ''; // Clear previous content

    const today = new Date();
    const todayString = today.toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    Object.keys(events).forEach(dateKey => {
        if (dateKey >= todayString) {
            events[dateKey].forEach(event => {
                const eventDiv = document.createElement('div');
                eventDiv.className = 'upcomingEvent';
                eventDiv.innerHTML = `
                    <strong>${event.text}</strong><br>
                    Date: ${dateKey}<br>
                    Time: ${event.time || 'Not specified'}<br>
                    Location: ${event.location || 'Not specified'}<br>
                `;
                upcomingEventsSection.appendChild(eventDiv);
            });
        }
    });
}


// Initialize the calendar with the current month
displayMonth();
