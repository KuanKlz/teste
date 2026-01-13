import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import base44 from "../../api/base44Client";
import { Button } from "./button";

export default function QuickAppointmentModal({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const { data: barbers = [] } = useQuery({ queryKey: ["barbers"], queryFn: () => base44.entities.Barber.list() });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => base44.entities.Service.list() });

  const activeBarbers = useMemo(() => barbers.filter((b) => b.status === "active"), [barbers]);

  const [clientName, setClientName] = useState("");
  const [barberId, setBarberId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [dateTime, setDateTime] = useState(() => new Date().toISOString().slice(0, 16)); // yyyy-MM-ddTHH:mm

  const createMutation = useMutation({
    mutationFn: (payload) => base44.entities.Appointment.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      setClientName("");
      setBarberId("");
      setServiceId("");
      setDateTime(new Date().toISOString().slice(0, 16));
      onOpenChange?.(false);
    },
  });

  if (!open) return null;

  return (
    <div className="modalOverlay" onMouseDown={() => onOpenChange?.(false)}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <div className="modalTitle">Novo atendimento</div>
          <button className="btn" onClick={() => onOpenChange?.(false)}>Fechar</button>
        </div>
        <div className="modalBody">
          <div className="formRow">
            <div>
              <label className="label">Cliente</label>
              <input className="input" value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Nome do cliente" />
            </div>
            <div>
              <label className="label">Data e hora</label>
              <input className="input" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
            </div>
          </div>

          <div className="formRow" style={{ marginTop: 10 }}>
            <div>
              <label className="label">Barbeiro</label>
              <select className="input" value={barberId} onChange={(e) => setBarberId(e.target.value)}>
                <option value="">Selecione…</option>
                {activeBarbers.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Serviço</label>
              <select className="input" value={serviceId} onChange={(e) => setServiceId(e.target.value)}>
                <option value="">Selecione…</option>
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} — R$ {Number(s.price).toFixed(2)}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
            <Button onClick={() => onOpenChange?.(false)}>Cancelar</Button>
            <Button
              variant="primary"
              disabled={!clientName || !barberId || !serviceId || createMutation.isPending}
              onClick={() =>
                createMutation.mutate({
                  clientName,
                  barberId,
                  serviceId,
                  dateTime: new Date(dateTime).toISOString(),
                  status: "scheduled",
                })
              }
            >
              Salvar
            </Button>
          </div>
          <div style={{ marginTop: 10, color: "rgba(232,238,252,0.65)", fontSize: 12 }}>
            Dica: depois você pode marcar como <b>concluído</b> na tela de Atendimentos.
          </div>
        </div>
      </div>
    </div>
  );
}
