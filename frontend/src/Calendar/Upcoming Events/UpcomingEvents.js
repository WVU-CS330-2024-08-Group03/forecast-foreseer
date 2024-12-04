import React, { useEffect, useState } from 'react';
import "./UpcomingEventsStyles.css";

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]); // State to store upcoming events

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem('events')) || {};
        let sortedEvents = Object.keys(storedEvents).flatMap(date =>
            storedEvents[date].map(event => ({ date, ...event }))
        ).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Get the next 5 upcoming events
        let nextFiveEvents = sortedEvents.slice(0, 5);
        setEvents(nextFiveEvents); // Update the state with the upcoming events
    }, []); // Empty dependency array to run the effect once on component mount

    return (
        <div>
            <h1>Upcoming Events</h1>
            {events.length === 0 ? (
                <p>No upcoming events.</p>
            ) : (
                events.map((event, index) => (
                    <div key={index} className="event">
                        <p>Date: {event.date}</p>
                        <p>Event: {event.text}</p>
                        <span
                            className="eventColor"
                            style={{ backgroundColor: event.color }}
                        ></span>
                    </div>
                ))
            )}
        </div>
    );
}

export default UpcomingEvents;