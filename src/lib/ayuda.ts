import type { CategoriaId } from "./reclamos";

export interface Articulo {
  id: string;
  cat: CategoriaId;
  titulo: string;
  tipo: "Guía" | "FAQ";
  pasos: string[];
}

export const ARTICULOS: Articulo[] = [
  { id: "eduroam", cat: "internet", tipo: "Guía", titulo: "Eduroam no conecta", pasos: ["Olvida la red eduroam en tu dispositivo.", "Vuelve a conectarte usando tu correo completo (nombre@usm.cl).", "Acepta el certificado si te lo pide.", "Si sigue fallando, reinicia el WiFi del equipo."] },
  { id: "lenta", cat: "internet", tipo: "FAQ", titulo: "¿Por qué la red está lenta?", pasos: ["En horas punta (11:00–14:00) la red tiene alta demanda.", "Acércate a otra sala o zona con mejor señal.", "Si la red se cae por completo en un edificio, repórtalo."] },
  { id: "contrasena", cat: "internet", tipo: "Guía", titulo: "Recuperar contraseña USM", pasos: ["Entra a la página de cuentas USM.", "Elige “Olvidé mi contraseña” e ingresa tu RUT.", "Revisa tu correo alternativo y sigue el enlace."] },
  { id: "papel", cat: "banos", tipo: "FAQ", titulo: "Baño sin papel o jabón", pasos: ["El aseo repone insumos 3 veces al día.", "Si falta hace más de 2 horas, haz un reclamo indicando el piso y edificio."] },
  { id: "fuga", cat: "banos", tipo: "Guía", titulo: "Fuga de agua o inundación", pasos: ["Aléjate del agua si hay enchufes cerca.", "Avisa al guardia más cercano para cortar el agua.", "Luego envía un reclamo con foto para el registro."] },
  { id: "luz", cat: "luminarias", tipo: "FAQ", titulo: "Luz apagada en sala", pasos: ["Revisa si el interruptor está junto a la puerta o en el pasillo.", "Si varias salas están sin luz, puede ser un corte general: consulta con portería.", "Si es solo un tubo o foco, reclama indicando la sala."] },
  { id: "silla", cat: "mobiliario", tipo: "FAQ", titulo: "Silla o mesa rota", pasos: ["No la uses para evitar accidentes.", "Déjala a un costado de la sala.", "Reclama indicando la sala y cuántos muebles están dañados."] },
  { id: "aire", cat: "climatizacion", tipo: "FAQ", titulo: "El aire acondicionado no enfría", pasos: ["Verifica que puertas y ventanas estén cerradas.", "Espera 15 minutos tras encenderlo.", "Si no hay control remoto en la sala, pídelo en portería."] },
  { id: "plazos", cat: "otro", tipo: "FAQ", titulo: "¿Cuánto demoran en responder?", pasos: ["Internet: 4 horas. Baños: 24 horas. Luminarias: 48 horas.", "Mobiliario y climatización: 72 horas.", "Puedes ver el avance en “Mis reclamos”."] },
  { id: "seguir", cat: "otro", tipo: "FAQ", titulo: "¿Cómo sigo mi reclamo?", pasos: ["Al enviar recibes un código como INC 2026-016482.", "Entra a “Mis reclamos” y búscalo por código.", "Verás cada cambio de estado con su hora."] },
];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function buscar(q: string, cat: CategoriaId | null) {
  const n = norm(q.trim());
  return ARTICULOS.filter((a) => (!cat || a.cat === cat) && (!n || norm(a.titulo + " " + a.pasos.join(" ")).includes(n)));
}
