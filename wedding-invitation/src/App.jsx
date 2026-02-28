import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Invitation from "./pages/Invitation";
import RSVPList from "./pages/RSVPList";

const App = () => {
  return (
    <Router basename="/wedding-invitation-studio/">
      <Routes>
        <Route path="/" element={<Invitation />} />
        <Route path="/rsvp-list" element={<RSVPList />} />
        {/* <Route path="*" element={<Invitation />} /> */}
        {/* Bạn có thể thêm các route khác ở đây */}
      </Routes>
    </Router>
  );
};

export default App;
