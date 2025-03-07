import React, { useState, useEffect } from "react";

const HabitList = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    fetchUserData(parsedUser.id);
  }, []);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleIncrement = async (habitId) => {
    if (!user) return;

    const updatedHabits = user.habits.map((habit) =>
      habit.id === habitId
        ? {
            ...habit,
            streak: habit.streak + 1,
            lastCompleted: new Date().toISOString().split("T")[0],
          }
        : habit
    );

    const goldReward = user.habits.find((habit) => habit.id === habitId)?.streak % 7 === 6 ? 10 : 0;

    const updatedUser = { ...user, habits: updatedHabits, gold: user.gold + goldReward };

    try {
      await updateUser(updatedUser);
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  const handleDelete = async (habitId) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      habits: user.habits.filter((habit) => habit.id !== habitId),
    };

    try {
      await updateUser(updatedUser);
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  };

  const updateUser = async (updatedUser) => {
    try {
      await fetch(`http://localhost:5000/users/${updatedUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser)); // Keep localStorage in sync
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="habit-list">
      <h2>Habit Tracker</h2>
      {user && user.habits.length === 0 && <p>No habits found.</p>}
      {user &&
        user.habits.map((habit) => (
          <div key={habit.id} className="habit-card">
            <h3>{habit.name}</h3>
            <p>Streak: {habit.streak} days</p>
            <p>Last completed: {habit.lastCompleted || "Never"}</p>
            <button onClick={() => handleIncrement(habit.id)}>Mark Done</button>
            <button onClick={() => handleDelete(habit.id)}>Delete</button>
          </div>
        ))}
    
      {user && <p>Your Gold: {user.gold}</p>}
    </div>
  );
};

export default HabitList;