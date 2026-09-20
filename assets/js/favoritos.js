/**
 * FavoritosPage
 * Controlador de favoritos.html: obtiene los IDs guardados desde
 * FavoritesStore, los cruza con noticias.json y permite filtrar,
 * buscar y eliminar (individual o en bloque).
 */
(function () {
  let noticiasGuardadas = [];
  let categoriaActiva = "all";

  function actualizarStats(lista) {
    document.getElementById("statTotalCount").textContent = lista.length;
    document.getElementById("statTotalTime").textContent = `${lista.reduce((sum, n) => sum + n.tiempoLectura, 0)} min`;

    const conteoPorCategoria = {};
    lista.forEach((n) => (conteoPorCategoria[n.categoria] = (conteoPorCategoria[n.categoria] || 0) + 1));
    const top = Object.entries(conteoPorCategoria).sort((a, b) => b[1] - a[1])[0];
    document.getElementById("statTopCategory").textContent = top ? top[0] : "—";
  }

  function renderPills(lista) {
    const categorias = [...new Set(lista.map((n) => n.categoria))];
    const contenedor = document.getElementById("favFilterContainer");
    const todas = ["all", ...categorias];
    contenedor.innerHTML = todas
      .map((cat) => {
        const activa = cat === categoriaActiva;
        const label = cat === "all" ? `Todos (${lista.length})` : cat;
        return `<button class="fav-filter-pill px-space-sm py-1.5 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap ${
          activa ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:text-on-surface"
        }" data-filter="${cat}">${label}</button>`;
      })
      .join("");

    contenedor.querySelectorAll(".fav-filter-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        categoriaActiva = pill.getAttribute("data-filter");
        aplicarFiltros();
      });
    });
  }

  function aplicarFiltros() {
    const query = document.getElementById("favSearchInput").value.trim().toLowerCase();
    const filtradas = noticiasGuardadas.filter((n) => {
      const coincideCategoria = categoriaActiva === "all" || n.categoria === categoriaActiva;
      const coincideBusqueda = query === "" || n.titulo.toLowerCase().includes(query) || n.categoria.toLowerCase().includes(query);
      return coincideCategoria && coincideBusqueda;
    });
    pintarLista(filtradas);
    renderPills(noticiasGuardadas);
  }

  function pintarLista(lista) {
    const container = document.getElementById("favArticlesContainer");
    const emptyState = document.getElementById("favEmptyState");

    if (noticiasGuardadas.length === 0) {
      container.classList.add("hidden");
      emptyState.classList.remove("hidden");
      emptyState.classList.add("flex");
      return;
    }

    container.classList.remove("hidden");
    emptyState.classList.add("hidden");
    emptyState.classList.remove("flex");

    if (lista.length === 0) {
      container.innerHTML = `<p class="font-body-sm text-body-sm text-on-surface-variant text-center py-space-xl">No hay artículos guardados que coincidan con tu búsqueda.</p>`;
      return;
    }

    container.innerHTML = lista.map(Render.favoriteListItem).join("");
    container.querySelectorAll(".delete-fav-btn").forEach((btn) => {
      btn.addEventListener("click", () => eliminarFavorito(btn.getAttribute("data-id")));
    });
  }

  function eliminarFavorito(id) {
    const article = document.querySelector(`.article-item[data-id="${id}"]`);
    FavoritesStore.remove(id);
    if (article) {
      article.style.transition = "all 0.3s ease";
      article.style.opacity = "0";
      article.style.transform = "translateX(20px)";
    }
    Toast.show("Artículo eliminado", "Se eliminó el artículo de tu lista de guardados.", "bookmark_remove");
    setTimeout(cargarYPintar, 280);
  }

  async function cargarYPintar() {
    const idsGuardados = FavoritesStore.getAll();
    try {
      const todas = await DataService.getNoticias();
      noticiasGuardadas = todas.filter((n) => idsGuardados.includes(n.id));
      actualizarStats(noticiasGuardadas);
      aplicarFiltros();
    } catch (err) {
      document.getElementById("favArticlesContainer").innerHTML = `<p class="font-body-sm text-body-sm text-error">No se pudieron cargar tus favoritos.</p>`;
      console.error(err);
    }
  }

  function wireModal() {
    const modal = document.getElementById("modalClearAll");
    const modalBox = document.getElementById("modalBox");

    document.getElementById("btnOpenClearModal").addEventListener("click", () => {
      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100");
      modalBox.classList.remove("scale-95");
      modalBox.classList.add("scale-100");
    });

    function cerrar() {
      modal.classList.remove("opacity-100");
      modal.classList.add("opacity-0", "pointer-events-none");
      modalBox.classList.remove("scale-100");
      modalBox.classList.add("scale-95");
    }

    document.getElementById("btnCancelClear").addEventListener("click", cerrar);
    document.getElementById("btnConfirmClear").addEventListener("click", () => {
      FavoritesStore.clear();
      cerrar();
      Toast.show("Biblioteca vaciada", "Se eliminaron todos los artículos guardados.", "delete_sweep");
      cargarYPintar();
    });
  }

  function init() {
    cargarYPintar();
    wireModal();
    document.getElementById("favSearchInput").addEventListener("input", aplicarFiltros);
    FavoritesStore.onChange(cargarYPintar);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
