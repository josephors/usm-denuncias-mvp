import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { useEffect, useState } from "react";
import { getCategoria } from "@/lib/reclamos";
import { ESTADOS, estadoActual, historial, leerTickets, type Estado, type Ticket } from "@/lib/tickets";

export const Route = createFileRoute("/seguimiento")({
  head: () => ({
    meta: [
      { title: "Mis reclamos · USM Denuncias" },
      { name: "description", content: "Revisa en tiempo real el estado e historial de tus reclamos en los campus USM." },
      { property: "og:title", content: "Mis reclamos · USM Denuncias" },
      { property: "og:description", content: "Panel de seguimiento transparente de tickets USM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Seguimiento,
});

const COLOR: Record<Estado, string> = {
  Recibido: "bg-secondary text-secondary-foreground",
  "En revisión": "bg-accent text-accent-foreground",
  "Técnico asignado": "bg-primary text-primary-foreground",
  Resuelto: "bg-success text-success-foreground",
};

const hora = (ms: number) => new Date(ms).toLocaleString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

function Seguimiento() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ahora, setAhora] = useState(Date.now());
  const [q, setQ] = useState("");
  const [filtro, setFiltro] = useState<"Todos" | "Abiertos" | "Resueltos">("Todos");
  const [abierto, setAbierto] = useState<string | null>(null);

  useEffect(() => {
    const t = leerTickets();
    setTickets(t);
    setAbierto(t[0]?.codigo ?? null);
    const id = setInterval(() => { setAhora(Date.now()); setTickets(leerTickets()); }, 5000);
    return () => clearInterval(id);
  }, []);

  const lista = tickets.filter((t) => {
    const e = estadoActual(t, ahora);
    if (filtro === "Abiertos" && e === "Resuelto") return false;
    if (filtro === "Resueltos" && e !== "Resuelto") return false;
    return t.codigo.toLowerCase().replace(/\s/g, "").includes(q.toLowerCase().replace(/\s/g, ""));
  });
  const abiertos = tickets.filter((t) => estadoActual(t, ahora) !== "Resuelto").length;

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-lg px-5 py-6">
        <div className="flex items-end justify-between">
          <h1 className="text-2xl font-bold">Mis reclamos</h1>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-success" /> Actualizado en vivo
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{abiertos} en curso · {tickets.length - abiertos} resueltos</p>

        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por código, ej: INC 2026-016482"
          className="mt-4 w-full rounded-xl border-2 border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary" />
        <div className="mt-3 flex gap-2">
          {(["Todos", "Abiertos", "Resueltos"] as const).map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${filtro === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{f}</button>
          ))}
        </div>

        {tickets.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-card p-6 text-center shadow-sm">
            <p className="text-4xl">📭</p>
            <p className="mt-2 font-semibold">Aún no tienes reclamos</p>
            <p className="text-sm text-muted-foreground">Cuando envíes uno, aparecerá aquí con su estado.</p>
            <Link to="/" className="mt-4 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Hacer un reclamo</Link>
          </div>
        ) : lista.length === 0 ? (
          <p className="mt-8 text-center text-sm text-muted-foreground">No hay reclamos que coincidan.</p>
        ) : (
          <ul className="mt-5 space-y-3">
            {lista.map((t) => {
              const c = getCategoria(t.cat);
              const e = estadoActual(t, ahora);
              const paso = ESTADOS.indexOf(e);
              const open = abierto === t.codigo;
              return (
                <li key={t.codigo} className="rounded-2xl bg-card shadow-sm">
                  <button onClick={() => setAbierto(open ? null : t.codigo)} className="w-full p-4 text-left" aria-expanded={open}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{c.emoji} {c.nombre}</p>
                        <p className="text-xs text-muted-foreground">{t.lugar} · {t.campus}</p>
                        <p className="mt-1 font-mono text-xs text-primary">{t.codigo}</p>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${COLOR[e]}`}>{e}</span>
                    </div>
                    <div className="mt-3 flex gap-1">
                      {ESTADOS.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= paso ? "bg-success" : "bg-border"}`} />)}
                    </div>
                  </button>
                  {open && (
                    <div className="border-t px-4 pb-4 pt-3">
                      <p className="text-sm text-muted-foreground">"{t.desc}"</p>
                      <p className="mt-2 text-xs text-muted-foreground">Área: <b className="text-foreground">{c.area}</b> · Plazo: {c.plazo}</p>
                      <ol className="mt-4 space-y-3 border-l-2 border-border pl-4">
                        {historial(t, ahora).map((h) => (
                          <li key={h.estado} className="relative">
                            <span className={`absolute -left-[23px] top-1 h-3 w-3 rounded-full ${h.hecho ? "bg-success" : "bg-border"}`} />
                            <p className={`text-sm ${h.hecho ? "font-semibold" : "text-muted-foreground"}`}>{h.estado}</p>
                            <p className="text-xs text-muted-foreground">{h.hecho ? hora(h.at) : "Pendiente"}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
