import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import base44 from "../api/base44Client";
import { Button } from "../components/ui/button";
import { Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

export default function Barbers() {
  const qc = useQueryClient();
  const { data: barbers = [] } = useQuery({ queryKey: ["barbers"], queryFn: () => base44.entities.Barber.list() });

  const [name, setName] = useState("");
  const [commissionRate, setCommissionRate] = useState(0.4);

  const createM = useMutation({
    mutationFn: (payload) => base44.entities.Barber.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barbers"] }),
  });

  const updateM = useMutation({
    mutationFn: ({ id, patch }) => base44.entities.Barber.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barbers"] }),
  });

  const removeM = useMutation({
    mutationFn: (id) => base44.entities.Barber.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["barbers"] }),
  });

  return (
    <div className="panel">
      <div className="panelPad" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div className="title" style={{ fontSize: 22 }}>Barbeiros</div>
            <div className="subtitle">Cadastre barbeiros e a taxa de comissão.</div>
          </div>
        </div>

        <div className="formRow" style={{ marginTop: 14 }}>
          <div>
            <label className="label">Nome</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: João" />
          </div>
          <div>
            <label className="label">Comissão (%)</label>
            <input
              className="input"
              type="number"
              step="1"
              min="0"
              max="100"
              value={Math.round(Number(commissionRate) * 100)}
              onChange={(e) => setCommissionRate(Math.max(0, Math.min(1, Number(e.target.value) / 100)))}
            />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Button
            variant="primary"
            onClick={() => {
              if (!name.trim()) return;
              createM.mutate({ name: name.trim(), status: "active", commissionRate: Number(commissionRate) });
              setName("");
              setCommissionRate(0.4);
            }}
          >
            <Plus size={16} /> Adicionar
          </Button>
        </div>
      </div>

      <div className="panelPad">
        <table className="table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Status</th>
              <th>Comissão</th>
              <th style={{ textAlign:"right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map((b) => (
              <tr key={b.id}>
                <td><b>{b.name}</b></td>
                <td>
                  <span className={"pill " + (b.status === "active" ? "ok" : "bad")}>
                    {b.status === "active" ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td>{Math.round(Number(b.commissionRate||0)*100)}%</td>
                <td style={{ textAlign:"right", display:"flex", justifyContent:"flex-end", gap: 8 }}>
                  <Button
                    onClick={() => updateM.mutate({ id: b.id, patch: { status: b.status === "active" ? "inactive" : "active" } })}
                  >
                    {b.status === "active" ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {b.status === "active" ? "Desativar" : "Ativar"}
                  </Button>
                  <Button variant="danger" onClick={() => removeM.mutate(b.id)}>
                    <Trash2 size={16} /> Remover
                  </Button>
                </td>
              </tr>
            ))}
            {barbers.length===0 ? <tr><td colSpan={4} style={{ color:"rgba(232,238,252,0.65)" }}>Nenhum barbeiro cadastrado.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
