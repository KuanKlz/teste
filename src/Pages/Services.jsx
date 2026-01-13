import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import base44 from "../api/base44Client";
import { Button } from "../components/ui/button";
import { Plus, Trash2, Pencil } from "lucide-react";

export default function Services() {
  const qc = useQueryClient();
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => base44.entities.Service.list() });

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);

  const createM = useMutation({
    mutationFn: (payload) => base44.entities.Service.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });

  const updateM = useMutation({
    mutationFn: ({ id, patch }) => base44.entities.Service.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });

  const removeM = useMutation({
    mutationFn: (id) => base44.entities.Service.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
  });

  return (
    <div className="panel">
      <div className="panelPad" style={{ borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="title" style={{ fontSize: 22 }}>Serviços</div>
        <div className="subtitle">Cadastre serviços e preços.</div>

        <div className="formRow" style={{ marginTop: 14 }}>
          <div>
            <label className="label">Nome do serviço</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Corte + Barba" />
          </div>
          <div>
            <label className="label">Preço (R$)</label>
            <input className="input" type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
          <Button
            variant="primary"
            onClick={() => {
              if (!name.trim()) return;
              createM.mutate({ name: name.trim(), price: Number(price) });
              setName("");
              setPrice(0);
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
              <th>Serviço</th>
              <th style={{ textAlign:"right" }}>Preço</th>
              <th style={{ textAlign:"right" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td><b>{s.name}</b></td>
                <td style={{ textAlign:"right" }}>R$ {Number(s.price||0).toFixed(2)}</td>
                <td style={{ textAlign:"right", display:"flex", justifyContent:"flex-end", gap:8 }}>
                  <Button
                    onClick={() => {
                      const newPrice = Number(prompt("Novo preço (R$):", String(s.price ?? 0)) ?? s.price);
                      if (Number.isFinite(newPrice)) updateM.mutate({ id: s.id, patch: { price: newPrice } });
                    }}
                  >
                    <Pencil size={16} /> Editar
                  </Button>
                  <Button variant="danger" onClick={() => removeM.mutate(s.id)}>
                    <Trash2 size={16} /> Remover
                  </Button>
                </td>
              </tr>
            ))}
            {services.length===0 ? <tr><td colSpan={3} style={{ color:"rgba(232,238,252,0.65)" }}>Nenhum serviço cadastrado.</td></tr> : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
