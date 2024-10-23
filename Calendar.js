const monthDisplay = document.getElementById('calendarMonth');
const calendarBody = document.getElementById('calendarBody');
let currentMonth = new Date();

// Function to display the days of the current month
function displayMonth() {

    // Clear previous calendar
    calendarBody.innerHTML = '';

    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();

    // Set the month display
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthDisplay.textContent = `${monthNames[month]} ${year}`;

    // Get the first day of the month and the number of days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let day = 1;
    let rowCount = Math.ceil((firstDay + daysInMonth) / 7);  // Calculate the number of rows needed

    // Create the Calendar
    for (let i = 0; i < rowCount; i++) { // Use the calculated number of rows
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            cell.className = 'calendarCell';

            if (i === 0 && j < firstDay) {
                // Empty cells before the first day of the month
                cell.textContent = '';
            } else if (day > daysInMonth) {
                // Empty cells after the last day of the month
                cell.textContent = '';
            } else {
                // Fill with the actual date
                cell.textContent = day;
                day++;
            }

            row.appendChild(cell);
        }
        calendarBody.appendChild(row);
    }
}

// Function to change the month (1 for next month, -1 for previous month)
function changeMonth(offset) {
    currentMonth.setMonth(currentMonth.getMonth() + offset);
    displayMonth();
}

// Initialize the calendar with the current month
displayMonth();