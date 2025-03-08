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
  const [habits, setHabits] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) setUserId(currentUser.id);
  }, []);

  useEffect(() => {
    if (authenticated && userId) fetchHabits();
  }, [authenticated, userId]);

  const fetchHabits = async () => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user data");

      const user = await response.json();
      setHabits(user.habits || []);
    } catch (error) {
      console.error("Error fetching habits:", error);
    }
  };

  const addHabit = async (habit) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const user = await response.json();
      const newHabit = { id: Date.now().toString(), ...habit };

      user.habits.push(newHabit);

      await fetch(`http://localhost:5000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      setHabits((prev) => [...prev, newHabit]);
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  const handleLogin = () => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser) setUserId(currentUser.id);
    setAuthenticated(true);
    localStorage.setItem("authenticated", "true");
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setUserId(null);
    setHabits([]);
    localStorage.removeItem("authenticated");
    localStorage.removeItem("currentUser");
  };

  return (
    <Router>
      {authenticated && <NavBar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/habits" /> : <Login setAuthenticated={handleLogin} />}
        />
        <Route
          path="/signup"
          element={authenticated ? <Navigate to="/habits" /> : <Signup setAuthenticated={handleLogin} />}
        />
        <Route
          path="/habits"
          element={
            authenticated ? (
              <div className="app">
                <h1>Habit Tracker</h1>
                <AddHabit userId={userId} setHabits={setHabits} />
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
        <Route
          path="/profile"
          element={authenticated ? <Profile habits={habits} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
