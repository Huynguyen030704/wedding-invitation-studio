import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Invitation from "./pages/Invitation";
import RSVPList from "./pages/RSVPList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/vu-quy" replace />} />
        <Route path="/vu-quy" element={<Invitation type="bride" />} />
        <Route path="/tan-hon" element={<Invitation type="groom" />} />
        <Route path="/rsvp-list" element={<RSVPList />} />
      </Routes>
    </Router>
  );
};

export default App;
