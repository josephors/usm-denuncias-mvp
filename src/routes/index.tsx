import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { useState } from "react";
import { CATEGORIAS, CAMPUS, getCategoria, generarCodigo, type CategoriaId } from "@/lib/reclamos";
import { guardarTicket } from "@/lib/tickets";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nuevo reclamo · USM Denuncias" },
      { name: "description", content: "Reporta un problema en tu campus USM en 3 pasos simples: qué pasa, dónde y una breve descripción." },
      { property: "og:title", content: "Nuevo reclamo · USM Denuncias" },
      { property: "og:description", content: "Formulario simplificado para reportar problemas en los campus USM." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const PASOS = ["¿Qué pasa?", "¿Dónde?", "Detalles"];

function Index() {
  const [paso, setPaso] = useState(0);
  const [cat, setCat] = useState<CategoriaId | null>(null);
  const [campus, setCampus] = useState("");
  const [lugar, setLugar] = useState("");
  const [desc, setDesc] = useState("");
  const [foto, setFoto] = useState<File | null>(null);
  const [codigo, setCodigo] = useState<string | null>(null);

  const categoria = cat ? getCategoria(cat) : null;
  const puedeSeguir = [!!cat, !!campus && lugar.trim().length > 1, desc.trim().length >= 10][paso];

  const reiniciar = () => { setPaso(0); setCat(null); setCampus(""); setLugar(""); setDesc(""); setFoto(null); setCodigo(null); };

  if (codigo && categoria) {
    return (
      <Shell>
        <div className="rounded-2xl bg-card p-6 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-3xl text-success-foreground">✓</div>
          <h1 className="mt-4 text-2xl font-bold">¡Reclamo enviado!</h1>
          <p className="mt-1 text-muted-foreground">Lo recibimos correctamente. Te avisaremos a tu correo @usm.cl.</p>
          <div className="mt-5 rounded-xl bg-secondary p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Código de seguimiento</p>
            <p className="font-display text-2xl font-bold text-primary">{codigo}</p>
          </div>
          <dl className="mt-5 space-y-3 text-left text-sm">
            <Fila k="Problema" v={`${categoria.emoji} ${categoria.nombre}`} />
            <Fila k="Lugar" v={`${lugar} · ${campus}`} />
            <Fila k="Lo atenderá" v={categoria.area} />
            <Fila k="Primera respuesta" v={`Dentro de ${categoria.plazo}`} />
          </dl>
          <ol className="mt-6 flex justify-between text-xs">
            {["Recibido", "En revisión", "Resuelto"].map((e, i) => (
              <li key={e} className="flex flex-1 flex-col items-center gap-1">
                <span className={`h-3 w-3 rounded-full ${i === 0 ? "bg-success" : "bg-border"}`} />
                <span className={i === 0 ? "font-semibold" : "text-muted-foreground"}>{e}</span>
              </li>
            ))}
          </ol>
          <Link to="/seguimiento" className="mt-6 block w-full rounded-xl bg-primary py-3 font-semibold text-primary-foreground">Ver estado en vivo</Link>
          <button onClick={reiniciar} className="mt-3 w-full rounded-xl border-2 border-primary py-3 font-semibold text-primary">Hacer otro reclamo</button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div>
        <div className="mb-2 flex justify-between text-xs font-semibold text-muted-foreground">
          <span>Paso {paso + 1} de 3</span><span>{PASOS[paso]}</span>
        </div>
        <div className="flex gap-1.5">
          {PASOS.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= paso ? "bg-accent" : "bg-border"}`} />)}
        </div>
      </div>

      {paso === 0 && (
        <section className="mt-6">
          <h1 className="text-2xl font-bold">¿Qué problema encontraste?</h1>
          <p className="mt-1 text-sm text-muted-foreground">Elige la opción más parecida. Nosotros lo derivamos al área correcta.</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {CATEGORIAS.map((c) => (
              <button key={c.id} data-selected={cat === c.id} onClick={() => setCat(c.id)} className="choice-card p-4 text-left">
                <div className="text-3xl">{c.emoji}</div>
                <div className="mt-2 font-semibold">{c.nombre}</div>
                <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{c.ejemplo}</div>
              </button>
            ))}
          </div>
          {categoria?.ayuda && (
            <div className="mt-4 rounded-xl border-l-4 border-accent bg-card p-4 text-sm">
              <p className="font-semibold">💡 {categoria.ayuda.titulo}</p>
              <p className="mt-1 text-muted-foreground">{categoria.ayuda.texto}</p>
            </div>
          )}
        </section>
      )}

      {paso === 1 && (
        <section className="mt-6 space-y-5">
          <h1 className="text-2xl font-bold">¿Dónde ocurre?</h1>
          <div>
            <label className="mb-2 block text-sm font-semibold">Campus o sede</label>
            <div className="space-y-2">
              {CAMPUS.map((c) => (
                <button key={c} data-selected={campus === c} onClick={() => setCampus(c)} className="choice-card block w-full px-4 py-3 text-left font-medium">{c}</button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="lugar" className="mb-2 block text-sm font-semibold">Edificio, sala o lugar</label>
            <input id="lugar" value={lugar} maxLength={80} onChange={(e) => setLugar(e.target.value)} placeholder="Ej: Sala B10, baño 2° piso edificio A"
              className="w-full rounded-xl border-2 border-input bg-card px-4 py-3 outline-none focus:border-primary" />
          </div>
        </section>
      )}

      {paso === 2 && categoria && (
        <section className="mt-6 space-y-5">
          <h1 className="text-2xl font-bold">Cuéntanos qué pasa</h1>
          <div>
            <label htmlFor="desc" className="mb-2 block text-sm font-semibold">Descripción</label>
            <textarea id="desc" value={desc} maxLength={500} rows={5} onChange={(e) => setDesc(e.target.value)}
              placeholder={`Ej: ${categoria.ejemplo.split(",")[0]} desde esta mañana.`}
              className="w-full rounded-xl border-2 border-input bg-card px-4 py-3 outline-none focus:border-primary" />
            <p className="mt-1 text-right text-xs text-muted-foreground">{desc.length}/500 · mínimo 10</p>
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-input bg-card p-4">
            <span className="text-2xl">📷</span>
            <span className="text-sm"><span className="font-semibold">{foto ? foto.name : "Agregar foto"}</span><br /><span className="text-muted-foreground">Opcional, ayuda a resolver más rápido</span></span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFoto(e.target.files?.[0] ?? null)} />
          </label>
          <div className="rounded-xl bg-secondary p-4 text-sm">
            <p className="font-semibold">Resumen</p>
            <p className="mt-1">{categoria.emoji} {categoria.nombre} · {lugar}, {campus}</p>
            <p className="mt-1 text-muted-foreground">Se enviará a <b className="text-foreground">{categoria.area}</b> · respuesta en {categoria.plazo}</p>
            <p className="mt-1 text-muted-foreground">Reportado por ti con tu cuenta USM.</p>
          </div>
        </section>
      )}

      <div className="sticky bottom-0 mt-8 flex gap-3 bg-background py-4">
        {paso > 0 && <button onClick={() => setPaso(paso - 1)} className="rounded-xl border-2 border-input px-5 py-3 font-semibold">Atrás</button>}
        <button disabled={!puedeSeguir}
          onClick={() => {
            if (paso < 2) return setPaso(paso + 1);
            const c = generarCodigo(categoria!.tipoInterno);
            guardarTicket({ codigo: c, cat: cat!, campus, lugar, desc, creado: Date.now() });
            setCodigo(c);
          }}
          className="flex-1 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition disabled:opacity-40">
          {paso < 2 ? "Continuar" : "Enviar reclamo"}
        </button>
      </div>
    </Shell>
  );
}

function Fila({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4 border-b pb-2"><dt className="text-muted-foreground">{k}</dt><dd className="text-right font-medium">{v}</dd></div>;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-lg px-5 pt-6">{children}</main>
    </div>
  );
}
