import React, { useMemo } from "react";

export default function BarberRanking({ barbers = [], appointments = [] }) {
  const ranking = useMemo(() => {
    const map = new Map();
    for (const b of barbers) {
      map.set(b.id, { barberId: b.id, name: b.name, count: 0, revenue: 0, commission: 0 });
    }
    for (const a of appointments) {
      const r = map.get(a.barberId) || { barberId: a.barberId, name: a.barberName || "—", count: 0, revenue: 0, commission: 0 };
      if (a.status === "completed") {
        r.count += 1;
        r.revenue += Number(a.servicePrice || 0);
        r.commission += Number(a.commissionAmount || 0);
      }
      map.set(a.barberId, r);
    }
    return [...map.values()].sort((x,y)=> y.revenue - x.revenue);
  }, [barbers, appointments]);

  return (
    <div className="panel">
      <div className="panelPad" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>Ranking de barbeiros</div>
        <div style={{ color: "rgba(232,238,252,0.65)", fontSize: 12, marginTop: 4 }}>
          Baseado em atendimentos concluídos.
        </div>
      </div>

      <div className="panelPad">
        <table className="table">
          <thead>
            <tr>
              <th>Barbeiro</th>
              <th style={{ textAlign:"right" }}>Atend.</th>
              <th style={{ textAlign:"right" }}>Fatur.</th>
              <th style={{ textAlign:"right" }}>Comissão</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((r) => (
              <tr key={r.barberId}>
                <td>{r.name}</td>
                <td style={{ textAlign:"right" }}>{r.count}</td>
                <td style={{ textAlign:"right" }}>R$ {r.revenue.toFixed(2)}</td>
                <td style={{ textAlign:"right" }}>R$ {r.commission.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
