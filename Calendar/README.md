Monthly Calendar
----------------
A simple and interactive calendar that allows users to view, add and delete events for specific dates. It uses local storage to store events between sessions and is fully functional

Features:
Dynamic display: Has correct days for current month

Event Management: Users can add events to specific dates, providing event title, day, time, location, and color code the event.

Event Deletion: Events can be deleted from the calendar.

Event Highlight: The event is displayed within the calendar with the assigned color

Modal Interface for adding events: A user friendly modal for imputting events.

Responsive Design: Calendar will adapt to different screen sizes

** How to Use **

1. Navigation: Click "Prev Month" and "Next Month" to navigate between months

2. Add Event" Click on any calendar cell to open the event creation modal, then fill out the fields. Then hit "Add event" to save the event to the calendar.

3. Delete an event: Click on the event in the calendar to open the modual. Then click the "Delete" button to remove it.

4. Persistance: Events are saved in local storage so reloadign the page won't impact them

** Installation **

1. git clone https://github.com/larissasophie/Monthly-Calendar.git
2. cd Monthly-Calendar
3. Open index.html

** API Reference **
Functions:
    displayMonth()
        - Description: Renders current month on calendar
        - Params: None
        - Returns: None
    addEvent()
        - Description: Adds event to selected date
        - Params: None (data used from modal)
        - Returns: None
    changeMonth(offset)
        - Description: Changes display month
        - Params: offset(number) (-1 for prev month, 1 for next month)
        - Returns: None
    
** Test **

1. Open calendar in browser
2. Add events by clicking on a day and fill out the form, add event
3. Verify presence of event and refresh page to ensure it stays
4. Delete event to make sure they are properly removed

** How to Use **
1. View the calendar: The calendar will display the current month by default.
2. Navigate Between Months: Click the "Prev Month" or "Next Month" buttons to change months.
3. Add an Event:

    Click any date on the calendar.
    A modal will appear. Enter the event details (event name, time, location color).
    Click "Add Event" to save.

4. Delete an Event: Click an event in the modal to remove it from the calendar.

** Credits **
inspired by calendar applications found during research.