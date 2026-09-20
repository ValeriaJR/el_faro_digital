/**
 * DataService
 * Centraliza la carga de los archivos JSON (noticias y servicios) vía fetch,
 * con una caché en memoria para evitar solicitudes repetidas dentro de la
 * misma sesión de navegación.
 */
const DataService = (() => {
  let _noticiasCache = null;
  let _serviciosCache = null;

  async function getNoticias() {
    if (_noticiasCache) return _noticiasCache;
    const res = await fetch("assets/data/noticias.json");
    if (!res.ok) throw new Error("No se pudieron cargar las noticias (" + res.status + ")");
    _noticiasCache = await res.json();
    return _noticiasCache;
  }

  async function getServicios() {
    if (_serviciosCache) return _serviciosCache;
    const res = await fetch("assets/data/servicios.json");
    if (!res.ok) throw new Error("No se pudieron cargar los servicios (" + res.status + ")");
    _serviciosCache = await res.json();
    return _serviciosCache;
  }

  async function getNoticiaPorId(id) {
    const noticias = await getNoticias();
    return noticias.find((n) => n.id === id) || null;
  }

  async function getRelacionadas(id, categoria, limite = 3) {
    const noticias = await getNoticias();
    return noticias
      .filter((n) => n.id !== id && n.categoria === categoria)
      .slice(0, limite);
  }

  return { getNoticias, getServicios, getNoticiaPorId, getRelacionadas };
})();
