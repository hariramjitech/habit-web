import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HabitList from "./components/HabitList";
import AddHabit from "./components/AddHabit";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import Profile from "./components/Profile";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  const [authenticated, setAuthenticated] = useState(
    localStorage.getItem("authenticated") === "true"
  );
  const [user, setUser] = useState(null);
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (authenticated && user) fetchHabits();
  }, [authenticated, user]);

  const fetchHabits = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${user.id}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const userData = await response.json();
      setHabits(userData.habits || []);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const handleLogin = (userData) => {
    setAuthenticated(true);
    setUser(userData);
    localStorage.setItem("authenticated", "true");
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUser(null);
    localStorage.removeItem("authenticated");
    localStorage.removeItem("currentUser");
  };

  return (
    <Router>
      {authenticated && <NavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={authenticated ? <Navigate to="/habits" /> : <Login setAuthenticated={handleLogin} />} />
        <Route path="/signup" element={authenticated ? <Navigate to="/habits" /> : <Signup setAuthenticated={handleLogin} />} />
        <Route
          path="/habits"
          element={
            authenticated ? (
              <div className="app">
                <h1>Habit Tracker</h1>
                <AddHabit userId={user?.id} setHabits={setHabits} />
                <HabitList habits={habits} setHabits={setHabits} />
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/profile" element={authenticated ? <Profile habits={habits} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
