import React, { useState, useEffect } from 'react';
import { X, Banknote, CreditCard, Smartphone, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function QuickAppointmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  barbers, 
  services,
  editingAppointment 
}) {
  const [formData, setFormData] = useState({
    barber_id: '',
    service_id: '',
    payment_method: 'pix',
    client_name: '',
    notes: ''
  });
  const [calculatedCommission, setCalculatedCommission] = useState(0);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBarber, setSelectedBarber] = useState(null);

  useEffect(() => {
    if (editingAppointment) {
      setFormData({
        barber_id: editingAppointment.barber_id,
        service_id: editingAppointment.service_id,
        payment_method: editingAppointment.payment_method,
        client_name: editingAppointment.client_name || '',
        notes: editingAppointment.notes || ''
      });
    } else {
      setFormData({
        barber_id: '',
        service_id: '',
        payment_method: 'pix',
        client_name: '',
        notes: ''
      });
    }
  }, [editingAppointment, isOpen]);

  useEffect(() => {
    const service = services.find(s => s.id === formData.service_id);
    const barber = barbers.find(b => b.id === formData.barber_id);
    setSelectedService(service);
    setSelectedBarber(barber);

    if (service && barber) {
      let commission = 0;
      if (barber.commission_type === 'percentage') {
        commission = (service.price * barber.commission_value) / 100;
      } else {
        commission = barber.commission_value;
      }
      setCalculatedCommission(commission);
    } else {
      setCalculatedCommission(0);
    }
  }, [formData.barber_id, formData.service_id, barbers, services]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const appointmentData = {
      ...formData,
      barber_name: selectedBarber?.name,
      service_name: selectedService?.name,
      service_price: selectedService?.price,
      commission_amount: calculatedCommission,
      net_amount: (selectedService?.price || 0) - calculatedCommission,
      appointment_date: editingAppointment?.appointment_date || new Date().toISOString(),
      status: 'completed'
    };

    onSave(appointmentData, editingAppointment?.id);
  };

  if (!isOpen) return null;

  const activeBarbers = barbers.filter(b => b.status === 'active');
  const activeServices = services.filter(s => s.status === 'active');

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] rounded-2xl w-full max-w-lg border border-white/10 shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">
            {editingAppointment ? 'Editar Atendimento' : 'Novo Atendimento'}
          </h2>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-white/70">Barbeiro</Label>
            <Select
              value={formData.barber_id}
              onValueChange={(value) => setFormData({ ...formData, barber_id: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione o barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {activeBarbers.map((barber) => (
                  <SelectItem key={barber.id} value={barber.id}>
                    {barber.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Serviço</Label>
            <Select
              value={formData.service_id}
              onValueChange={(value) => setFormData({ ...formData, service_id: value })}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {activeServices.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - R$ {service.price?.toFixed(2)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Forma de Pagamento</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'pix', icon: Smartphone, label: 'PIX' },
                { value: 'card', icon: CreditCard, label: 'Cartão' },
                { value: 'cash', icon: Banknote, label: 'Dinheiro' },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, payment_method: value })}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                    formData.payment_method === value
                      ? "bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]"
                      : "bg-white/5 border-white/10 text-white/60 hover:border-white/20"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-white/70">Nome do Cliente (opcional)</Label>
            <Input
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              className="bg-white/5 border-white/10 text-white"
              placeholder="Ex: João Silva"
            />
          </div>

          {/* Commission Preview */}
          {selectedService && selectedBarber && (
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-[#d4af37]" />
                <span className="text-white/70 text-sm font-medium">Resumo</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Valor do serviço</span>
                  <span className="text-white">R$ {selectedService.price?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Comissão ({selectedBarber.commission_type === 'percentage' ? `${selectedBarber.commission_value}%` : 'Fixo'})</span>
                  <span className="text-[#d4af37]">R$ {calculatedCommission.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="text-white/70 font-medium">Líquido barbearia</span>
                  <span className="text-white font-semibold">R$ {(selectedService.price - calculatedCommission).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!formData.barber_id || !formData.service_id}
              className="flex-1 bg-gradient-to-r from-[#d4af37] to-[#b8962e] text-black font-semibold hover:opacity-90"
            >
              {editingAppointment ? 'Salvar' : 'Registrar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}