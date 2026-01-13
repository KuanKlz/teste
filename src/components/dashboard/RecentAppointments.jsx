import React, { useMemo } from "react";

function pill(status){
  if(status==="completed") return <span className="pill ok">Concluído</span>;
  if(status==="scheduled") return <span className="pill warn">Agendado</span>;
  if(status==="canceled") return <span className="pill bad">Cancelado</span>;
  return <span className="pill">{status}</span>;
}

export default function RecentAppointments({ appointments = [] }) {
  const rows = useMemo(() => {
    return [...appointments].sort((a,b)=> (a.dateTime||"") < (b.dateTime||"") ? 1 : -1).slice(0, 8);
  }, [appointments]);

  return (
    <div className="panel">
      <div className="panelPad" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ fontWeight: 900, fontSize: 16 }}>Últimos atendimentos</div>
        <div style={{ color: "rgba(232,238,252,0.65)", fontSize: 12, marginTop: 4 }}>
          Visão rápida do que está acontecendo agora.
        </div>
      </div>

      <div className="panelPad">
        <table className="table">
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Barbeiro</th>
              <th>Serviço</th>
              <th>Status</th>
              <th style={{ textAlign:"right" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id}>
                <td>{a.clientName}</td>
                <td>{a.barberName}</td>
                <td>{a.serviceName}</td>
                <td>{pill(a.status)}</td>
                <td style={{ textAlign:"right" }}>R$ {Number(a.servicePrice||0).toFixed(2)}</td>
              </tr>
            ))}
            {rows.length===0 ? (
              <tr><td colSpan={5} style={{ color:"rgba(232,238,252,0.65)" }}>Nenhum atendimento ainda.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
