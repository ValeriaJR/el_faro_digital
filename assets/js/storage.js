/**
 * FavoritesStore
 * Persiste los IDs de noticias guardadas por el lector en localStorage,
 * de modo que "Mis Favoritos" se mantiene sincronizado entre páginas y
 * entre pestañas del navegador (evento 'storage').
 */
const FavoritesStore = (() => {
  const KEY = "elfaro_favoritos";
  const EVENT_NAME = "favoritesChanged";

  function _read() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("No se pudo leer favoritos de localStorage:", err);
      return [];
    }
  }

  function _write(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { favoritos: list } }));
    } catch (err) {
      console.error("No se pudo guardar favoritos en localStorage:", err);
    }
  }

  function getAll() {
    return _read();
  }

  function isFavorite(id) {
    return _read().includes(id);
  }

  function add(id) {
    const list = _read();
    if (!list.includes(id)) {
      list.push(id);
      _write(list);
    }
    return true;
  }

  function remove(id) {
    const list = _read().filter((item) => item !== id);
    _write(list);
    return false;
  }

  function toggle(id) {
    return isFavorite(id) ? (remove(id), false) : (add(id), true);
  }

  function clear() {
    _write([]);
  }

  function count() {
    return _read().length;
  }

  function onChange(callback) {
    window.addEventListener(EVENT_NAME, callback);
    // 'storage' se dispara cuando OTRA pestaña modifica el localStorage
    window.addEventListener("storage", (e) => {
      if (e.key === KEY) callback();
    });
  }

  return { getAll, isFavorite, add, remove, toggle, clear, count, onChange };
})();
