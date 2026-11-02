import { Link } from "@tanstack/react-router";

const base = "rounded-lg px-2.5 py-1.5 text-xs font-semibold";

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-2 px-5 py-4">
        <Link to="/" className="font-display text-lg font-bold">USM <span className="text-accent">Denuncias</span></Link>
        <nav className="flex gap-1">
          <Link to="/ayuda" className={base} activeProps={{ className: "underline underline-offset-4" }}>Ayuda</Link>
          <Link to="/seguimiento" className={base} activeProps={{ className: "underline underline-offset-4" }}>Mis reclamos</Link>
          <Link to="/" className={`${base} bg-accent text-accent-foreground`}>+ Reclamo</Link>
        </nav>
      </div>
    </header>
  );
}
