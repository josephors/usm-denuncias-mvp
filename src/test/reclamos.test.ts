import { describe, it, expect } from "vitest";
import { getCategoria, generarCodigo } from "@/lib/reclamos";

describe("reclamos", () => {
  it("internet se deriva a la Mesa de Servicios DTI", () => {
    expect(getCategoria("internet").area).toBe("Mesa de Servicios DTI");
  });
  it("baños se derivan a Mantención y Aseo", () => {
    expect(getCategoria("banos").area).toBe("Mantención y Aseo");
  });
  it("código usa formato INC año-número", () => {
    expect(generarCodigo("Incidencia", new Date(2026, 10, 1), 16482)).toBe("INC 2026-016482");
  });
});
