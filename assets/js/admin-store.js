/**
 * AdminStore
 * Simula un backend de gestión de contenidos: las noticias base viven en
 * noticias.json (solo lectura), y las operaciones de creación, edición y
 * eliminación hechas desde el panel de administración se guardan como
 * "overrides" en localStorage, para no depender de un servidor real.
 */
const AdminStore = (() => {
  const KEY = "elfaro_admin_overrides";

  function _read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { agregadas: [], editadas: {}, eliminadasIds: [] };
    } catch (err) {
      console.error("No se pudo leer el panel de administración:", err);
      return { agregadas: [], editadas: {}, eliminadasIds: [] };
    }
  }

  function _write(data) {
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  function generarId(titulo) {
    const base = titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return `${base}-${Date.now().toString(36)}`;
  }

  function getMerged(noticiasBase) {
    const overrides = _read();
    const base = noticiasBase
      .filter((n) => !overrides.eliminadasIds.includes(n.id))
      .map((n) => overrides.editadas[n.id] || n);
    return [...base, ...overrides.agregadas];
  }

  function create(noticia) {
    const overrides = _read();
    const nueva = {
      ...noticia,
      id: generarId(noticia.titulo),
      colorBadge: "bg-surface-container text-on-surface",
      vistas: 0,
      destacada: false
    };
    overrides.agregadas.push(nueva);
    _write(overrides);
    return nueva;
  }

  function update(id, cambios) {
    const overrides = _read();
    const esAgregada = overrides.agregadas.findIndex((n) => n.id === id);
    if (esAgregada !== -1) {
      overrides.agregadas[esAgregada] = { ...overrides.agregadas[esAgregada], ...cambios };
    } else {
      overrides.editadas[id] = { ...cambios, id };
    }
    _write(overrides);
  }

  function remove(id) {
    const overrides = _read();
    const esAgregada = overrides.agregadas.findIndex((n) => n.id === id);
    if (esAgregada !== -1) {
      overrides.agregadas.splice(esAgregada, 1);
    } else {
      overrides.eliminadasIds.push(id);
      delete overrides.editadas[id];
    }
    _write(overrides);
  }

  return { getMerged, create, update, remove };
})();
