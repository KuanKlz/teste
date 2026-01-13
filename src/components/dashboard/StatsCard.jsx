import React from "react";

export default function StatsCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="panel panelPad">
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ color: "rgba(232,238,252,0.72)", fontSize: 12, fontWeight: 700 }}>{title}</div>
          <div style={{ fontSize: 24, fontWeight: 900, marginTop: 6 }}>{value}</div>
          <div style={{ color: "rgba(232,238,252,0.65)", fontSize: 12, marginTop: 6 }}>{subtitle}</div>
        </div>
        {Icon ? (
          <div style={{
            width: 40, height: 40, borderRadius: 14,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.14)",
            display: "grid", placeItems: "center"
          }}>
            <Icon size={18} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
