import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin") {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({ username: "admin", role: "admin" })
      );

      navigate("/dashboard");
      return;
    }

    setError("Usuário ou senha inválidos");
  };

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 18 }}>
      <form onSubmit={handleSubmit} style={{ width: "min(520px, 100%)" }}>
        <h1 style={{ marginBottom: 6 }}>Entrar</h1>

        {error ? <p style={{ color: "tomato" }}>{error}</p> : null}

        <div style={{ marginTop: 14 }}>
          <label>Usuário</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div style={{ marginTop: 10 }}>
          <label>Senha</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button style={{ marginTop: 14 }} type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}
