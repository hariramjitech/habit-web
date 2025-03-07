import React, { useState } from "react";

const AddHabit = ({ userId, setHabits }) => {
  const [name, setName] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Habit name cannot be empty!");
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
    <form onSubmit={handleSubmit} className="add-habit">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter new habit"
      />
      <button type="submit">Add Habit</button>
    </form>
  );
};

export default AddHabit;
