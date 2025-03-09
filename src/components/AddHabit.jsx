import React, { useState } from "react";


const AddHabit = ({ userId, setHabits }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(""), 3000); // Auto-dismiss alert after 3 seconds
  };



  

  const addHabit = async (habit) => {
    if (!userId) {
      console.error("Error: User ID is missing.");
      showAlert("User ID is missing. Please log in again.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`http://localhost:5000/users/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch user");

      const user = await response.json();

      if (user.habits.some((h) => h.name.toLowerCase() === habit.name.toLowerCase())) {
        showAlert("Habit already exists!");
        setLoading(false);
        return;
      }

      const newHabit = { id: Date.now().toString(), ...habit };

      user.habits.push(newHabit);

      await fetch(`http://localhost:5000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      setHabits((prev) => [...prev, newHabit]);
      showAlert("Habit added successfully!");
    } catch (error) {
      console.error("Error adding habit:", error);
      showAlert("Error adding habit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showAlert("Habit name cannot be empty!");
      return;
    }

    const newHabit = {
      name,
      streak: 0,
      lastCompleted: null,
    };

    await addHabit(newHabit);
    setName("");
  };

  return (
    <div className="add-habit-container">
      {alertMessage && <div className="alert-popup">{alertMessage}</div>}

      <form onSubmit={handleSubmit} className="add-habit">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter new habit"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Habit"}
        </button>
      </form>
    </div>
  );
};

export default AddHabit;
