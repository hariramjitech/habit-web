import React, { useState, useEffect } from "react";

const HabitList = () => {
  const [habits, setHabits] = useState([]);
  const [user, setUser] = useState(null);
  const [newHabit, setNewHabit] = useState("");

  // ✅ Fetch habits & user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const habitResponse = await fetch("http://localhost:5000/habits");
        if (!habitResponse.ok) throw new Error("Failed to fetch habits");

        const habitData = await habitResponse.json();
        setHabits(habitData);

        const storedUser = JSON.parse(localStorage.getItem("currentUser"));
        if (storedUser && storedUser.id) {
          // ✅ Check if user exists in the backend
          const userResponse = await fetch(`http://localhost:5000/users/${storedUser.id}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData);
          } else {
            console.error("User not found in backend!");
            setUser(null);
          }
        } else {
          console.error("No user found in localStorage.");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ✅ Handle habit completion & gold rewards
  const handleIncrement = async (id) => {
    if (!user || !user.id) {
      console.error("User not found or missing ID!");
      return;
    }

    const habit = habits.find((h) => h.id === id);
    if (!habit) return;

    const earnedGold = habit.streak % 7 === 6 ? 10 : 0; // Gold every 7 days

    const updatedHabit = {
      ...habit,
      streak: habit.streak + 1,
      lastCompleted: new Date().toISOString().split("T")[0],
      gold: (habit.gold || 0) + earnedGold,
    };

    const updatedUser = {
      ...user,
      gold: user.gold + earnedGold, // Update user's total gold
    };

    try {
      console.log(`Updating habit at: http://localhost:5000/habits/${id}`);
      console.log(`Updating user at: http://localhost:5000/users/${user.id}`);

      // ✅ Update habit in backend
      const habitResponse = await fetch(`http://localhost:5000/habits/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedHabit),
      });

      if (!habitResponse.ok) throw new Error("Failed to update habit");

      // ✅ Update user in backend
      const userResponse = await fetch(`http://localhost:5000/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!userResponse.ok) throw new Error("Failed to update user");

      // ✅ Update localStorage & state
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setHabits((prev) => prev.map((h) => (h.id === id ? updatedHabit : h)));

    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  // ✅ Handle habit deletion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/habits/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete habit");

      setHabits((prev) => prev.filter((h) => h.id !== id));
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  // ✅ Handle adding a new habit
  const handleAddHabit = async () => {
    if (!newHabit.trim()) return alert("Habit name cannot be empty!");

    const newHabitObj = {
      name: newHabit,
      streak: 0,
      gold: 0,
      lastCompleted: null,
    };

    try {
      const response = await fetch("http://localhost:5000/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHabitObj),
      });

      if (!response.ok) throw new Error("Failed to add habit");

      const savedHabit = await response.json();
      setHabits((prev) => [...prev, savedHabit]);
      setNewHabit("");
    } catch (error) {
      console.error("Error adding habit:", error);
    }
  };

  return (
    <div className="habit-list">

      {/* ✅ Display habits */}
      {habits.length === 0 ? <p>No habits found.</p> : null}
      {habits.map((habit) => (
        <div key={habit.id} className="habit-card">
          <div className="habit-info">
            <h3>{habit.name}</h3>
            <p>Streak: {habit.streak} days</p>
            <p>Gold Points: {habit.gold || 0}</p>
            <p>Last completed: {habit.lastCompleted || "Never"}</p>
          </div>
          <div className="habit-actions">
            <button onClick={() => handleIncrement(habit.id)}>Mark Done</button>
            <button onClick={() => handleDelete(habit.id)}>Delete</button>
          </div>
        </div>
      ))}

      {/* ✅ Display user gold */}
      {user ? <p><strong>Your Gold:</strong> {user.gold}</p> : <p>No user found.</p>}
    </div>
  );
};

export default HabitList;
