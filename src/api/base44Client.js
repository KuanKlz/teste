// src/api/base44Client.js
// Camada de dados local (LocalStorage). Funciona offline e é fácil de trocar por backend depois.

const STORAGE_KEY = "barbearia:data:v1";

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function seed() {
  return {
    barbers: [
      { id: "b1", name: "João", status: "active", commissionRate: 0.4, createdAt: nowIso() },
      { id: "b2", name: "Pedro", status: "active", commissionRate: 0.35, createdAt: nowIso() },
      { id: "b3", name: "Lucas", status: "inactive", commissionRate: 0.3, createdAt: nowIso() },
    ],
    services: [
      { id: "s1", name: "Corte", price: 35, createdAt: nowIso() },
      { id: "s2", name: "Barba", price: 25, createdAt: nowIso() },
      { id: "s3", name: "Corte + Barba", price: 60, createdAt: nowIso() },
    ],
    appointments: [
      {
        id: "a1",
        clientName: "Carlos",
        barberId: "b1",
        serviceId: "s3",
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        status: "completed",
        createdAt: nowIso(),
      },
      {
        id: "a2",
        clientName: "Marcos",
        barberId: "b2",
        serviceId: "s1",
        dateTime: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        status: "completed",
        createdAt: nowIso(),
      },
      {
        id: "a3",
        clientName: "Rafael",
        barberId: "b1",
        serviceId: "s2",
        dateTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
        status: "scheduled",
        createdAt: nowIso(),
      },
    ],
  };
}

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = seed();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch {
    const initial = seed();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
}

function write(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function withComputed(data) {
  const barberById = new Map(data.barbers.map((b) => [b.id, b]));
  const serviceById = new Map(data.services.map((s) => [s.id, s]));

  const appointments = data.appointments.map((a) => {
    const barber = barberById.get(a.barberId);
    const service = serviceById.get(a.serviceId);
    const servicePrice = Number(service?.price ?? 0);
    const rate = Number(barber?.commissionRate ?? 0);
    const commission = a.status === "completed" ? servicePrice * rate : 0;
    return {
      ...a,
      barberName: barber?.name ?? "—",
      serviceName: service?.name ?? "—",
      servicePrice,
      commissionAmount: Number(commission.toFixed(2)),
    };
  });

  return { ...data, appointments };
}

function listBy(entity, opts = {}) {
  const data = withComputed(read());
  let rows = data[entity] ?? [];
  if (opts.orderBy) {
    const { field, dir } = opts.orderBy;
    rows = [...rows].sort((a, b) => {
      const av = a[field];
      const bv = b[field];
      if (av === bv) return 0;
      const res = av > bv ? 1 : -1;
      return dir === "desc" ? -res : res;
    });
  }
  if (typeof opts.limit === "number") rows = rows.slice(0, opts.limit);
  return rows;
}

function create(entity, payload) {
  const data = read();
  const row = { id: uid(), ...payload, createdAt: nowIso() };
  data[entity] = [row, ...(data[entity] ?? [])];
  write(data);
  return row;
}

function update(entity, id, patch) {
  const data = read();
  data[entity] = (data[entity] ?? []).map((r) => (r.id === id ? { ...r, ...patch } : r));
  write(data);
  return data[entity].find((r) => r.id === id) ?? null;
}

function remove(entity, id) {
  const data = read();
  data[entity] = (data[entity] ?? []).filter((r) => r.id !== id);
  // cascata simples: se remove barbeiro/serviço, mantém appointments mas marca como "—" via computed
  write(data);
  return true;
}

export const base44 = {
  entities: {
    Barber: {
      list: async () => listBy("barbers", { orderBy: { field: "createdAt", dir: "desc" } }),
      create: async (payload) => create("barbers", payload),
      update: async (id, patch) => update("barbers", id, patch),
      remove: async (id) => remove("barbers", id),
    },
    Service: {
      list: async () => listBy("services", { orderBy: { field: "createdAt", dir: "desc" } }),
      create: async (payload) => create("services", payload),
      update: async (id, patch) => update("services", id, patch),
      remove: async (id) => remove("services", id),
    },
    Appointment: {
      list: async (orderField = "dateTime", limit = 100) =>
        listBy("appointments", { orderBy: { field: orderField, dir: "desc" }, limit }),
      create: async (payload) => create("appointments", payload),
      update: async (id, patch) => update("appointments", id, patch),
      remove: async (id) => remove("appointments", id),
    },
  },
  reset: () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seed()));
  },
};

export default base44;
