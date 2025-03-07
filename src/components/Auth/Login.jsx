import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("currentUser", JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
          gold: user.gold,
          habits: user.habits
        })); 
        localStorage.setItem("authenticated", "true"); 
        setAuthenticated(true);
        navigate("/profile"); 
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Error connecting to server");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>
        New user? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default Login;
