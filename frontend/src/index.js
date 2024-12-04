import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import MainPage from './Main Page/MainPage';
import Calendar from './Calendar/Calendar';
import UpcomingEvents from './Calendar/Upcoming Events/UpcomingEvents';

import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/Calendar" element={<Calendar />} />
        <Route path="/UpcomingEvents" element={<UpcomingEvents />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();