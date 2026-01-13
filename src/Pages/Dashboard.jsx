import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DollarSign, Users, TrendingUp, Calendar, Plus } from "lucide-react";

import base44 from "../api/base44Client";
import StatsCard from "../components/dashboard/StatsCard";
import RecentAppointments from "../components/dashboard/RecentAppointments";
import BarberRanking from "../components/dashboard/BarberRanking";
import { Button } from "../components/ui/button";
import QuickAppointmentModal from "../components/ui/QuickAppointmentModal";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: barbers = [] } = useQuery({ queryKey: ["barbers"], queryFn: () => base44.entities.Barber.list() });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => base44.entities.Service.list() });
  const { data: appointments = [] } = useQuery({ queryKey: ["appointments"], queryFn: () => base44.entities.Appointment.list("dateTime", 200) });

  const activeBarbers = useMemo(() => barbers.filter((b) => b.status === "active"), [barbers]);

  const completed = useMemo(() => appointments.filter((a) => a.status === "completed"), [appointments]);

  const stats = useMemo(() => {
    const todayStr = new Date().toDateString();
    const todayCompleted = completed.filter((a) => new Date(a.dateTime).toDateString() === todayStr);

    const todayRevenue = todayCompleted.reduce((sum, a) => sum + (Number(a.servicePrice) || 0), 0);
    const todayCommission = todayCompleted.reduce((sum, a) => sum + (Number(a.commissionAmount) || 0), 0);
    const totalRevenue = completed.reduce((sum, a) => sum + (Number(a.servicePrice) || 0), 0);

    return {
      todayRevenue,
      todayCommission,
      totalRevenue,
      totalAppointments: completed.length,
      activeBarbers: activeBarbers.length,
      services: services.length,
    };
  }, [completed, activeBarbers, services]);

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="title">Dashboard</h1>
          <p className="subtitle">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Novo atendimento
        </Button>
      </div>

      <div className="grid4">
        <StatsCard
          title="Faturamento hoje"
          value={`R$ ${stats.todayRevenue.toFixed(2)}`}
          subtitle={`${stats.totalAppointments} atendimentos concluídos`}
          icon={DollarSign}
        />
        <StatsCard
          title="Comissão hoje"
          value={`R$ ${stats.todayCommission.toFixed(2)}`}
          subtitle="Somente concluídos"
          icon={TrendingUp}
        />
        <StatsCard
          title="Barbeiros ativos"
          value={`${stats.activeBarbers}`}
          subtitle="Disponíveis"
          icon={Users}
        />
        <StatsCard
          title="Faturamento total"
          value={`R$ ${stats.totalRevenue.toFixed(2)}`}
          subtitle={`${stats.services} serviços cadastrados`}
          icon={Calendar}
        />
      </div>

      <div style={{ height: 12 }} />

      <div className="row2">
        <RecentAppointments appointments={appointments} />
        <BarberRanking barbers={barbers} appointments={appointments} />
      </div>

      <QuickAppointmentModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  );
}
