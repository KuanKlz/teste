import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import base44 from "../api/base44Client";
import { Button } from "../components/ui/button";
import { CheckCircle2, XCircle, Trash2, Plus } from "lucide-react";
import QuickAppointmentModal from "../components/ui/QuickAppointmentModal";

function StatusPill({ status }) {
  if (status === "completed") return <span className="pill ok">Concluído</span>;
  if (status === "scheduled") return <span className="pill warn">Agendado</span>;
  if (status === "canceled") return <span className="pill bad">Cancelado</span>;
  return <span className="pill">{status}</span>;
}

export default function Appointments() {
  const qc = useQueryClient();
  const { data: appointments = [] } = useQuery({ queryKey: ["appointments"], queryFn: () => base44.entities.Appointment.list("dateTime", 300) });

  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const rows = useMemo(() => {
    const list = [...appointments].sort((a,b)=> (a.dateTime||"") < (b.dateTime||"") ? 1 : -1);
    if (filter === "all") return list;
    return list.filter((a) => a.status === filter);
  }, [appointments, filter]);

  const updateM = useMutation({
    mutationFn: ({ id, patch }) => base44.entities.Appointment.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });

  const removeM = useMutation({
    mutationFn: (id) => base44.entities.Appointment.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="title">Atendimentos</h1>
          <p className="subtitle">Agende, conclua e acompanhe comissões.</p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center" }}>
          <select className="input" style={{ width: 180 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos</option>
            <option value="scheduled">Agendados</option>
            <option value="completed">Concluídos</option>
            <option value="canceled">Cancelados</option>
          </select>
          <Button variant="primary" onClick={() => setOpen(true)}>
            <Plus size={16} /> Novo
          </Button>
        </div>
      </div>

      <div className="panel">
        <div className="panelPad">
          <table className="table">
            <thead>
              <tr>
                <th>Data/Hora</th>
                <th>Cliente</th>
                <th>Barbeiro</th>
                <th>Serviço</th>
                <th>Status</th>
                <th style={{ textAlign:"right" }}>Valor</th>
                <th style={{ textAlign:"right" }}>Comissão</th>
                <th style={{ textAlign:"right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.dateTime).toLocaleString()}</td>
                  <td><b>{a.clientName}</b></td>
                  <td>{a.barberName}</td>
                  <td>{a.serviceName}</td>
                  <td><StatusPill status={a.status} /></td>
                  <td style={{ textAlign:"right" }}>R$ {Number(a.servicePrice||0).toFixed(2)}</td>
                  <td style={{ textAlign:"right" }}>R$ {Number(a.commissionAmount||0).toFixed(2)}</td>
                  <td style={{ textAlign:"right", display:"flex", justifyContent:"flex-end", gap:8 }}>
                    <Button
                      onClick={() => updateM.mutate({ id: a.id, patch: { status: "completed" } })}
                      disabled={a.status === "completed"}
                      title="Marcar como concluído"
                    >
                      <CheckCircle2 size={16} /> Concluir
                    </Button>
                    <Button
                      onClick={() => updateM.mutate({ id: a.id, patch: { status: "canceled" } })}
                      disabled={a.status === "canceled"}
                      title="Cancelar"
                    >
                      <XCircle size={16} /> Cancelar
                    </Button>
                    <Button variant="danger" onClick={() => removeM.mutate(a.id)} title="Remover">
                      <Trash2 size={16} /> Remover
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length===0 ? <tr><td colSpan={8} style={{ color:"rgba(232,238,252,0.65)" }}>Nenhum atendimento.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      <QuickAppointmentModal open={open} onOpenChange={setOpen} />
    </>
  );
}
