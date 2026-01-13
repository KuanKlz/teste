import React, { useState } from "react";
import { login } from "../auth";

export default function Login({ onLogged }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState("");

  import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();

  if (username === "admin" && password === "admin") {
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ username: "admin", role: "admin" })
    );

    navigate("/dashboard"); // 🔥 aqui está a chave
    return;
  }

  alert("Usuário ou senha inválidos");
};

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 18 }}>
      <div className="panel" style={{ width: "min(520px, 100%)" }}>
        <div className="panelPad">
          <h1 className="title" style={{ marginBottom: 6 }}>Entrar</h1>
          <p className="subtitle">Use <b>admin</b> / <b>admin</b> (demo). Depois a gente troca por login real.</p>

          <div style={{ marginTop: 14 }}>
            <label className="label">Usuário</label>
            <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div style={{ marginTop: 10 }}>
            <label className="label">Senha</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error ? <div style={{ marginTop: 10, color: "rgba(255,107,107,0.95)", fontSize: 13 }}>{error}</div> : null}

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button
              className="btn btnPrimary"
              onClick={() => {
                const s = login(username, password);
                if (!s) return setError("Usuário ou senha inválidos.");
                setError("");
                onLogged?.(s);
              }}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
