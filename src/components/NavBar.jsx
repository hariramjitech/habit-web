import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar">
      <h2>Habit Tracker</h2>
      <div>
        <Link to="/habits">Home</Link>
        <Link to="/profile">Profile</Link>
      </div>
    </nav>
  );
};

export default NavBar;
