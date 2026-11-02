import type { CategoriaId } from "./reclamos";

export const ESTADOS = ["Recibido", "En revisión", "Técnico asignado", "Resuelto"] as const;
export type Estado = (typeof ESTADOS)[number];

/** Demo: minutos desde el envío en que el ticket avanza a cada estado. */
export const AVANCE_MIN = [0, 1, 3, 6];

export interface Ticket {
  codigo: string;
  cat: CategoriaId;
  campus: string;
  lugar: string;
  desc: string;
  creado: number;
}

const KEY = "usm-tickets";

export function leerTickets(): Ticket[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function guardarTicket(t: Ticket) {
  localStorage.setItem(KEY, JSON.stringify([t, ...leerTickets()]));
}

/** Historial: cada estado alcanzado con su hora. */
export function historial(t: Ticket, ahora = Date.now()) {
  return ESTADOS.map((estado, i) => {
    const at = t.creado + (AVANCE_MIN[i] ?? 0) * 60_000;
    return { estado, at, hecho: at <= ahora };
  });
}

export function estadoActual(t: Ticket, ahora = Date.now()): Estado {
  return [...historial(t, ahora)].reverse().find((h) => h.hecho)!.estado;
}
