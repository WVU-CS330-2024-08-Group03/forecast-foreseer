document.addEventListener('DOMContentLoaded', displayUpcomingEvents);

function displayUpcomingEvents() {
    const upcomingEventsDiv = document.getElementById('upcomingEvents');
    let events = JSON.parse(localStorage.getItem('events')) || {};

    // Get the current date in YYYY-MM-DD format to compare with event dates
    const today = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

    // Get an array of events sorted by date, but exclude past events
    let sortedEvents = Object.keys(events).flatMap(date => 
        events[date].map(event => ({ date, ...event }))
    ).filter(event => event.date >= today) // Filter out past events
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date

    // Get the next 5 upcoming events
    let nextFiveEvents = sortedEvents.slice(0, 5);

    // Clear previous events from the container before appending new events
    upcomingEventsDiv.innerHTML = '';

    // Loop through each upcoming event and display its details
    nextFiveEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';

        // Display the event date
        const eventDate = document.createElement('p');
        eventDate.textContent = `Date: ${event.date}`;
        eventDiv.appendChild(eventDate);

        // Display the event description
        const eventText = document.createElement('p');
        eventText.textContent = `Event: ${event.text}`;
        eventDiv.appendChild(eventText);

        // Display the event time (if available)
        if (event.time) {
            const eventTime = document.createElement('p');
            eventTime.textContent = `Time: ${event.time}`;
            eventDiv.appendChild(eventTime);
        }

        // Display the event location (if available)
        if (event.location) {
            const eventLocation = document.createElement('p');
            eventLocation.textContent = `Location: ${event.location}`;
            eventDiv.appendChild(eventLocation);
        }

        // Display the event color
        const eventColor = document.createElement('span');
        eventColor.textContent = ' ';
        eventColor.style.backgroundColor = event.color;
        eventColor.className = 'eventColor';
        eventDiv.appendChild(eventColor);

        // Add the event div to the upcoming events container
        upcomingEventsDiv.appendChild(eventDiv);
    });

    // If there are no upcoming events, show a message
    if (nextFiveEvents.length === 0) {
        upcomingEventsDiv.textContent = 'No upcoming events.';
    }
}
