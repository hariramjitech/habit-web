import React, { useState } from "react";

const AddHabit = ({ onAdd }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Habit name cannot be empty!");
      return;
    }

    const newHabit = {
      name,
      streak: 0,
      gold: 0,
      lastCompleted: null,
    };

    await onAdd(newHabit); // ✅ Call API & update state
    setName(""); // ✅ Clear input field
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
