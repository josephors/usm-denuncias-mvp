export type CategoriaId = "banos" | "luminarias" | "mobiliario" | "internet" | "climatizacion" | "otro";

export interface Categoria {
  id: CategoriaId;
  nombre: string;
  ejemplo: string;
  emoji: string;
  area: string;
  plazo: string;
  /** Tipo interno del sistema; el estudiante nunca lo elige. */
  tipoInterno: "Incidencia" | "Petición";
  ayuda?: { titulo: string; texto: string };
}

export const CATEGORIAS: Categoria[] = [
  { id: "banos", nombre: "Baños", ejemplo: "Sin agua, sin papel, fuga, sucio", emoji: "🚻", area: "Mantención y Aseo", plazo: "24 horas", tipoInterno: "Incidencia" },
  { id: "luminarias", nombre: "Luminarias", ejemplo: "Luz apagada, parpadea, sin energía", emoji: "💡", area: "Mantención Eléctrica", plazo: "48 horas", tipoInterno: "Incidencia" },
  { id: "mobiliario", nombre: "Mobiliario", ejemplo: "Silla, mesa, pizarra o puerta dañada", emoji: "🪑", area: "Mantención Infraestructura", plazo: "72 horas", tipoInterno: "Incidencia" },
  {
    id: "internet", nombre: "Internet / WiFi", ejemplo: "Eduroam no conecta, red lenta", emoji: "📶", area: "Mesa de Servicios DTI", plazo: "4 horas", tipoInterno: "Incidencia",
    ayuda: { titulo: "¿Ya probaste esto?", texto: "Olvida la red eduroam y vuelve a conectarte con tu correo @usm.cl completo. Si sigue fallando, continúa con tu reclamo." },
  },
  { id: "climatizacion", nombre: "Climatización", ejemplo: "Aire acondicionado o calefacción", emoji: "🌡️", area: "Mantención de Climatización", plazo: "72 horas", tipoInterno: "Incidencia" },
  { id: "otro", nombre: "Otro problema", ejemplo: "Algo que no está en la lista", emoji: "📝", area: "Mesa de Servicios Campus", plazo: "72 horas", tipoInterno: "Petición" },
];

export const CAMPUS = ["Casa Central Valparaíso", "Campus San Joaquín", "Campus Vitacura", "Sede Viña del Mar", "Sede Concepción"];

export function getCategoria(id: CategoriaId) {
  return CATEGORIAS.find((c) => c.id === id)!;
}

/** Código de seguimiento con el formato del sistema actual. */
export function generarCodigo(tipo: Categoria["tipoInterno"], fecha = new Date(), n = Math.floor(Math.random() * 900000) + 100000) {
  const pref = tipo === "Incidencia" ? "INC" : "PET";
  return `${pref} ${fecha.getFullYear()}-${String(n).padStart(6, "0")}`;
}
