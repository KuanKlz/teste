import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, Scissors, Users, CalendarDays, FileText, LogOut, RefreshCw } from "lucide-react";
import base44 from "./api/base44Client";

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => "navItem" + (isActive ? " active" : "")}
    >
      <div className="navLeft">
        <Icon size={18} />
        <span>{label}</span>
      </div>
      <span style={{ opacity: 0.5 }}>›</span>
    </NavLink>
  );
}

export default function Layout({ onLogout }) {
  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandMark">B</div>
          <div>
            <div className="brandTitle">Barbearia</div>
            <div className="brandSub">Dashboard & Comissões</div>
          </div>
        </div>

        <nav className="nav">
          <NavItem to="/" icon={BarChart3} label="Dashboard" />
          <NavItem to="/appointments" icon={CalendarDays} label="Atendimentos" />
          <NavItem to="/barbers" icon={Users} label="Barbeiros" />
          <NavItem to="/services" icon={Scissors} label="Serviços" />
          <NavItem to="/reports" icon={FileText} label="Relatórios" />
        </nav>

        <div style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={() => { base44.reset(); window.location.reload(); }}>
            <RefreshCw size={16} /> Reset dados
          </button>
          <button className="btn btnDanger" onClick={onLogout}>
            <LogOut size={16} /> Sair
          </button>
        </div>

        <div style={{ marginTop: 14, color: "rgba(232,238,252,0.55)", fontSize: 12, lineHeight: 1.4 }}>
          * Os dados estão salvos no seu navegador (LocalStorage). Depois a gente liga em um banco real.
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
