import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './CalendarStyles.css';

function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState(JSON.parse(localStorage.getItem('events')) || {});

    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Render month display
    const monthDisplay = `${monthNames[month]} ${year}`;

    // Function to display the days of the current month
    function displayMonth() {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        let day = 1;
        let rowCount = Math.ceil((firstDay + daysInMonth) / 7);
        const rows = [];
        for (let i = 0; i < rowCount; i++) {
            const cells = [];
            for (let j = 0; j < 7; j++) {
                const cellContent = i === 0 && j < firstDay ? '' : (day > daysInMonth ? '' : day);
                const dateKey = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const eventsForDay = events[dateKey] || [];
        
                const cell = (
                    <td key={j} className="calendarCell" onClick={() => openModal(dateKey)}>
                        {cellContent}
                        {eventsForDay.map((event, index) => (
                            <div key={index} className="eventText" style={{ backgroundColor: 'event.color' }}>
                                {event.text}
                            </div>
                        ))}
                    </td>
                );
        
                cells.push(cell);
                if (day <= daysInMonth) day++;
            }
            rows.push(<tr key={i}>{cells}</tr>);
        }
        return rows;
    }

    // Functions for opening and closing the modal
    const [modal, setModal] = useState(false);
    const span = document.getElementsByClassName("close")[0];
    const eventDate = document.getElementById("eventDate");
    const eventText = document.getElementById("eventText");
    const eventColor = document.getElementById("eventColor");
    let deleteButtons = [];

    function openModal(dateKey) {
        eventDate.value = dateKey;
        eventText.value = ''; // Clear the text field
        eventColor.value = ''; // Clear the color field
        setModal(true);

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
                deleteButton.onClick = () => deleteEvent(dateKey, index);
                deleteButton.style.float = 'right'; // Float the delete button to the right
                eventDiv.appendChild(deleteButton);

                modalContent.appendChild(eventDiv);
                deleteButtons.push(eventDiv); // Track the delete buttons for removal later
            });
        }
    }

    // Function to add an event to the selected date
    function addEvent() {
        const date = eventDate.value;
        const text = eventText.value;
        const color = eventColor.value;
        if (date && text && color) {
            if (!Array.isArray(events[date])) {
                events[date] = [];
            }
            events[date].push({ text, color }); // Add event to the events array for the date
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
        setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + offset)));
        displayMonth();
    }

    // Initialize the calendar with the current month
    displayMonth();

    // Color Picker Logic
    document.querySelectorAll('.colorButton').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('eventColor').value = this.getAttribute('data-color');
            document.querySelectorAll('.colorButton').forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    return(
        <div>
            {/* Header Ribbon */}
            <div class="headerRibbon">
                <Link to="/" className="headerLink">Main Page</Link>
                <Link to="/UpcomingEvents" className="headerLink">Upcoming Events</Link>
                </div>

            {/* Calendar Table */}
            <table id="calendar">
                <tr>
                    <th className="calendarTop" onClick={() => changeMonth(-1)}>Prev Month</th>
                    <th id="calendarMonth" class="calendarMonthName" colspan="5">{monthDisplay}</th>
                    <th class="calendarTop" onClick={() => changeMonth(1)}>Next Month</th>
                </tr>
                <tr>
                    <th class="calendarHeader">Sunday</th>
                    <th class="calendarHeader">Monday</th>
                    <th class="calendarHeader">Tuesday</th>
                    <th class="calendarHeader">Wednesday</th>
                    <th class="calendarHeader">Thursday</th>
                    <th class="calendarHeader">Friday</th>
                    <th class="calendarHeader">Saturday</th>
                </tr>
                <tbody id="calendarBody">
                    {displayMonth()}
                </tbody>
            </table>

            {/* Modal for creating events */}
            <div id="eventModal" class="modal">
                <div class="modal-content">
                    <span className="close" onClick={() => setModal(false)}>&times;</span>
                    <h2>Add Event</h2>
                    <form id="eventForm">
                        <label for="eventDate">Date:</label>
                        <input type="date" id="eventDate" readOnly/><br/><br/>
                        <label for="eventText">Event:</label>
                        <input type="text" id="eventText" required/><br/><br/>

                        {/* Gradient Color Picker */}
                        <label for="eventColor">Color:</label>
                        <select id="eventColor">
                            <option value="#FFCCCC" style={{ backgroundColor: '#FFCDD2' }}>Light Red</option>
                            <option value="#FF6666" style={{ backgroundColor: '#E57373' }}>Medium Red</option>
                            <option value="#CCFFCC" style={{ backgroundColor: '#C8E6C9' }}>Light Green</option>
                            <option value="#66FF66" style={{ backgroundColor: '#81C748' }}>Medium Green</option>
                            <option value="#CCCCFF" style={{ backgroundColor: '#BBDEFB' }}>Light Blue</option>
                            <option value="#6666FF" style={{ backgroundColor: '#64B5F6' }}>Medium Blue</option>
                            <option value="#FFFFCC" style={{ backgroundColor: '#FFFFCC' }}>Light Yellow</option>
                            <option value="#FFFF66" style={{ backgroundColor: '#FFFF66' }}>Medium Yellow</option>
                            <option value="#E6CCFF" style={{ backgroundColor: '#E1BEE7' }}>Light Purple</option>
                            <option value="#D1B3FF" style={{ backgroundColor: '#BA68C8' }}>Medium Purple</option>
                        </select>

                        <button type="button" id="addEventButton" onClick={addEvent}>Add Event</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Calendar;