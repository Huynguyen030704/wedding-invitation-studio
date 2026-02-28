import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Invitation from "./pages/Invitation";
import RSVPList from "./pages/RSVPList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Invitation />} />
        <Route path="/rsvp-list" element={<RSVPList />} />
      </Routes>
    </Router>
  );
};

export default App;
