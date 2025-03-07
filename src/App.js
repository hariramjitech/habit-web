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

    // ✅ Fetch habits once when authenticated
    useEffect(() => {
      if (authenticated) fetchHabits();
    }, [authenticated]);

    const fetchHabits = async () => {
      try {
        const response = await fetch("http://localhost:5000/habits");
        if (!response.ok) throw new Error("Failed to fetch habits");

        const data = await response.json();
        setHabits(data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      }
    };

    // ✅ Add a new habit and update state
    const addHabit = async (habit) => {
      try {
        const response = await fetch("http://localhost:5000/habits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(habit),
        });

        if (!response.ok) throw new Error("Failed to add habit");

        const newHabit = await response.json();
        setHabits((prev) => [...prev, newHabit]); // ✅ Update state correctly
      } catch (error) {
        console.error("Error adding habit:", error);
      }
    };

    const handleLogin = () => {
      setAuthenticated(true);
      localStorage.setItem("authenticated", "true");
    };

    const handleLogout = () => {
      setAuthenticated(false);
      localStorage.removeItem("authenticated");
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
                  <AddHabit onAdd={addHabit} />
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
