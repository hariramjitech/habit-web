import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    
    // Fetch existing users
    const response = await fetch("http://localhost:5000/users");
    const users = await response.json();

    // Check if user already exists
    if (users.some((u) => u.email === email)) {
      setError("User already exists. Please log in.");
      return;
    }

    // Generate new user ID
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

    // Create new user
    const newUser = {
      id: newId,
      name,
      email,
      password,
      gold: 0,
      habits: [],
    };

    // Save new user to db.json
    await fetch("http://localhost:5000/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });

    setSuccess("Account created successfully! Redirecting to login...");
    
    // Redirect to login after 2 seconds
    setTimeout(() => {
      navigate("/login");
    }, 2000);
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
      </form>
      <p>Already have an account? <Link to="/login">Log in here</Link></p>
    </div>
  );
};

export default Signup;
