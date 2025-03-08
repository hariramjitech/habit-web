import React, { useState } from "react";  // ✅ Ensure useState is imported
import { useNavigate, Link } from "react-router-dom"; // ✅ Ensure useNavigate is imported

const Login = ({ setAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // ✅ Added missing setError definition
  const navigate = useNavigate(); // ✅ Added missing navigate definition

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();
      const user = users.find((u) => u.email === email && u.password === password);

      if (user) {
        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          gold: user.gold,
          habits: user.habits || [],
        };

        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("authenticated", "true");

        setAuthenticated(true); // ✅ Fixed undefined setAuthenticated
        navigate("/profile");   // ✅ Fixed undefined navigate
      } else {
        setError("Invalid email or password"); // ✅ Fixed undefined setError
      }
    } catch (err) {
      setError("Error connecting to server"); // ✅ Fixed undefined setError
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
