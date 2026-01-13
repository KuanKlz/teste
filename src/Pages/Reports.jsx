import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import base44 from "../api/base44Client";
import { Button } from "../components/ui/button";
import { Download } from "lucide-react";

export default function Reports() {
  const { data: appointments = [] } = useQuery({ queryKey: ["appointments"], queryFn: () => base44.entities.Appointment.list("dateTime", 1000) });

  const [days, setDays] = useState(30);

  const filtered = useMemo(() => {
    const cutoff = Date.now() - Number(days) * 24 * 60 * 60 * 1000;
    return appointments
      .filter((a) => a.status === "completed")
      .filter((a) => new Date(a.dateTime).getTime() >= cutoff);
  }, [appointments, days]);

  const totals = useMemo(() => {
    const revenue = filtered.reduce((s,a)=> s + Number(a.servicePrice||0), 0);
    const commission = filtered.reduce((s,a)=> s + Number(a.commissionAmount||0), 0);
    return { revenue, commission, count: filtered.length };
  }, [filtered]);

  function downloadCsv() {
    const headers = ["data_hora","cliente","barbeiro","servico","valor","comissao","status"];
    const lines = [headers.join(",")];
    for (const a of filtered) {
      const row = [
        new Date(a.dateTime).toISOString(),
        a.clientName,
        a.barberName,
        a.serviceName,
        Number(a.servicePrice||0).toFixed(2),
        Number(a.commissionAmount||0).toFixed(2),
        a.status,
      ].map((x) => `"${String(x).replaceAll('"','""')}"`);
      lines.push(row.join(","));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_${days}dias.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="title">Relatórios</h1>
          <p className="subtitle">Resumo e exportação para CSV.</p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <select className="input" style={{ width: 220 }} value={days} onChange={(e) => setDays(Number(e.target.value))}>
            <option value={7}>Últimos 7 dias</option>
            <option value={15}>Últimos 15 dias</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={60}>Últimos 60 dias</option>
            <option value={90}>Últimos 90 dias</option>
          </select>
          <Button variant="primary" onClick={downloadCsv}>
            <Download size={16} /> Baixar CSV
          </Button>
        </div>
      </div>

      <div className="grid4">
        <div className="panel panelPad">
          <div style={{ color:"rgba(232,238,252,0.72)", fontSize:12, fontWeight:700 }}>Atendimentos</div>
          <div style={{ fontSize:24, fontWeight:900, marginTop:6 }}>{totals.count}</div>
          <div style={{ color:"rgba(232,238,252,0.65)", fontSize:12, marginTop:6 }}>Concluídos no período</div>
        </div>
        <div className="panel panelPad">
          <div style={{ color:"rgba(232,238,252,0.72)", fontSize:12, fontWeight:700 }}>Faturamento</div>
          <div style={{ fontSize:24, fontWeight:900, marginTop:6 }}>R$ {totals.revenue.toFixed(2)}</div>
          <div style={{ color:"rgba(232,238,252,0.65)", fontSize:12, marginTop:6 }}>Soma dos serviços</div>
        </div>
        <div className="panel panelPad">
          <div style={{ color:"rgba(232,238,252,0.72)", fontSize:12, fontWeight:700 }}>Comissões</div>
          <div style={{ fontSize:24, fontWeight:900, marginTop:6 }}>R$ {totals.commission.toFixed(2)}</div>
          <div style={{ color:"rgba(232,238,252,0.65)", fontSize:12, marginTop:6 }}>Baseado nos barbeiros</div>
        </div>
        <div className="panel panelPad">
          <div style={{ color:"rgba(232,238,252,0.72)", fontSize:12, fontWeight:700 }}>Média</div>
          <div style={{ fontSize:24, fontWeight:900, marginTop:6 }}>
            R$ {(totals.count ? totals.revenue / totals.count : 0).toFixed(2)}
          </div>
          <div style={{ color:"rgba(232,238,252,0.65)", fontSize:12, marginTop:6 }}>Ticket médio</div>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="panel">
        <div className="panelPad" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
          <div style={{ fontWeight: 900, fontSize: 16 }}>Detalhamento</div>
          <div style={{ color:"rgba(232,238,252,0.65)", fontSize:12, marginTop:4 }}>Somente atendimentos concluídos.</div>
        </div>
        <div className="panelPad">
          <table className="table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Cliente</th>
                <th>Barbeiro</th>
                <th>Serviço</th>
                <th style={{ textAlign:"right" }}>Valor</th>
                <th style={{ textAlign:"right" }}>Comissão</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.dateTime).toLocaleString()}</td>
                  <td>{a.clientName}</td>
                  <td>{a.barberName}</td>
                  <td>{a.serviceName}</td>
                  <td style={{ textAlign:"right" }}>R$ {Number(a.servicePrice||0).toFixed(2)}</td>
                  <td style={{ textAlign:"right" }}>R$ {Number(a.commissionAmount||0).toFixed(2)}</td>
                </tr>
              ))}
              {filtered.length===0 ? <tr><td colSpan={6} style={{ color:"rgba(232,238,252,0.65)" }}>Sem dados no período.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
