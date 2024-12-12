document.addEventListener('DOMContentLoaded', displayUpcomingEvents);

function displayUpcomingEvents() {
    const upcomingEventsDiv = document.getElementById('upcomingEvents');
    let events = JSON.parse(localStorage.getItem('events')) || {};

    // Get an array of events sorted by date
    let sortedEvents = Object.keys(events).flatMap(date => 
        events[date].map(event => ({ date, ...event }))
    ).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Get the next 5 upcoming events
    let nextFiveEvents = sortedEvents.slice(0, 5);

    nextFiveEvents.forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'event';

        const eventDate = document.createElement('p');
        eventDate.textContent = `Date: ${event.date}`;
        eventDiv.appendChild(eventDate);

        const eventText = document.createElement('p');
        eventText.textContent = `Event: ${event.text}`;
        eventDiv.appendChild(eventText);

        const eventColor = document.createElement('span');
        eventColor.textContent = ' ';
        eventColor.style.backgroundColor = event.color;
        eventColor.className = 'eventColor';
        eventDiv.appendChild(eventColor);

        upcomingEventsDiv.appendChild(eventDiv);
    });

    if (nextFiveEvents.length === 0) {
        upcomingEventsDiv.textContent = 'No upcoming events.';
    }
}
