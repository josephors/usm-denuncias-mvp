import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { buscar } from "@/lib/ayuda";
import { CATEGORIAS, type CategoriaId } from "@/lib/reclamos";

export const Route = createFileRoute("/ayuda")({
  head: () => ({
    meta: [
      { title: "Centro de ayuda · USM Denuncias" },
      { name: "description", content: "Guías y preguntas frecuentes para resolver problemas del campus USM antes de crear un reclamo." },
      { property: "og:title", content: "Centro de ayuda · USM Denuncias" },
      { property: "og:description", content: "Busca soluciones rápidas: WiFi, baños, luminarias, mobiliario y más." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ayuda,
});

function Ayuda() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<CategoriaId | null>(null);
  const [abierto, setAbierto] = useState<string | null>(null);
  const res = buscar(q, cat);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-lg px-5 py-6">
        <h1 className="text-2xl font-bold">¿En qué te ayudamos?</h1>
        <p className="mt-1 text-sm text-muted-foreground">Muchas dudas se resuelven en un minuto. Busca antes de reclamar.</p>

        <input value={q} onChange={(e) => setQ(e.target.value)} autoFocus placeholder="🔍  Ej: eduroam, fuga, silla…"
          className="mt-4 w-full rounded-xl border-2 border-input bg-card px-4 py-3 outline-none focus:border-primary" />

        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => setCat(null)} className={`rounded-full px-3 py-1 text-xs font-semibold ${!cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>Todo</button>
          {CATEGORIAS.map((c) => (
            <button key={c.id} onClick={() => setCat(cat === c.id ? null : c.id)}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${cat === c.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
              {c.emoji} {c.nombre}
            </button>
          ))}
        </div>

        <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{res.length} resultado{res.length !== 1 && "s"}</p>
        <ul className="mt-2 space-y-2">
          {res.map((a) => {
            const open = abierto === a.id;
            const c = CATEGORIAS.find((x) => x.id === a.cat)!;
            return (
              <li key={a.id} className="rounded-2xl bg-card shadow-sm">
                <button onClick={() => setAbierto(open ? null : a.id)} aria-expanded={open} className="flex w-full items-center gap-3 p-4 text-left">
                  <span className="text-2xl">{c.emoji}</span>
                  <span className="flex-1">
                    <span className="block font-semibold">{a.titulo}</span>
                    <span className="text-xs text-muted-foreground">{a.tipo} · {c.nombre}</span>
                  </span>
                  <span className={`text-muted-foreground transition ${open ? "rotate-180" : ""}`}>▾</span>
                </button>
                {open && (
                  <div className="border-t px-4 pb-4 pt-3">
                    <ol className="list-decimal space-y-1.5 pl-5 text-sm">
                      {a.pasos.map((p) => <li key={p}>{p}</li>)}
                    </ol>
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-secondary p-3 text-sm">
                      <span>¿No se solucionó?</span>
                      <Link to="/" className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">Crear reclamo</Link>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {res.length === 0 && (
          <div className="mt-4 rounded-2xl bg-card p-6 text-center shadow-sm">
            <p className="text-3xl">🤔</p>
            <p className="mt-2 font-semibold">No encontramos guías para “{q}”</p>
            <p className="text-sm text-muted-foreground">Prueba otra palabra o crea tu reclamo directamente.</p>
            <Link to="/" className="mt-4 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground">Crear reclamo</Link>
          </div>
        )}
      </main>
    </div>
  );
}
