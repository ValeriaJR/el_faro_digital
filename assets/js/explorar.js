/**
 * Explorar
 * Controlador de explorar.html: carga todas las noticias desde el JSON,
 * genera las píldoras de categoría dinámicamente, y aplica búsqueda +
 * filtro + orden sobre los datos en memoria.
 */
(function () {
  let TODAS_LAS_NOTICIAS = [];
  let categoriaActiva = "all";

  function leerCategoriaDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("categoria") || "all";
  }

  function renderPills(categorias) {
    const pillList = document.getElementById("categoryPillList");
    const todas = ["all", ...categorias];
    pillList.innerHTML = todas
      .map((cat) => {
        const activa = cat === categoriaActiva;
        const label = cat === "all" ? "Todos" : cat;
        return `<button class="filter-pill px-space-sm py-1.5 rounded-full font-label-md text-label-md transition-colors whitespace-nowrap ${
          activa ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:text-on-surface"
        }" data-filter="${cat}">${label}</button>`;
      })
      .join("");

    pillList.querySelectorAll(".filter-pill").forEach((pill) => {
      pill.addEventListener("click", () => {
        categoriaActiva = pill.getAttribute("data-filter");
        renderPills(categorias);
        aplicarFiltros();
      });
    });
  }

  function ordenar(lista, criterio) {
    const copia = [...lista];
    switch (criterio) {
      case "antiguo":
        return copia.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
      case "lectura-corta":
        return copia.sort((a, b) => a.tiempoLectura - b.tiempoLectura);
      case "populares":
        return copia.sort((a, b) => b.vistas - a.vistas);
      case "reciente":
      default:
        return copia.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }
  }

  function aplicarFiltros() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const criterio = document.getElementById("sortSelect").value;
    const clearBtn = document.getElementById("clearSearchBtn");
    clearBtn.classList.toggle("hidden", query.length === 0);

    let resultado = TODAS_LAS_NOTICIAS.filter((n) => {
      const coincideCategoria = categoriaActiva === "all" || n.categoria === categoriaActiva;
      const coincideBusqueda =
        query === "" || n.titulo.toLowerCase().includes(query) || n.resumen.toLowerCase().includes(query) || n.categoria.toLowerCase().includes(query);
      return coincideCategoria && coincideBusqueda;
    });

    resultado = ordenar(resultado, criterio);
    pintarResultados(resultado);
  }

  function pintarResultados(lista) {
    const grid = document.getElementById("cardsGrid");
    const emptyState = document.getElementById("emptyState");
    const counter = document.getElementById("resultsCounter");

    counter.textContent = `${lista.length} resultado${lista.length === 1 ? "" : "s"} encontrado${lista.length === 1 ? "" : "s"}`;

    if (lista.length === 0) {
      grid.innerHTML = "";
      grid.classList.add("hidden");
      emptyState.classList.remove("hidden");
      emptyState.classList.add("flex");
      return;
    }

    grid.classList.remove("hidden");
    emptyState.classList.add("hidden");
    emptyState.classList.remove("flex");
    grid.innerHTML = lista.map(Render.newsCard).join("");
    wireFavoriteButtons(grid);
  }

  function wireFavoriteButtons(scope) {
    scope.querySelectorAll(".card-fav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const title = btn.getAttribute("data-title") || "Artículo";
        const isNowFavorite = FavoritesStore.toggle(id);
        const icon = btn.querySelector(".material-symbols-outlined");

        icon.textContent = isNowFavorite ? "favorite" : "favorite_border";
        icon.style.fontVariationSettings = `'FILL' ${isNowFavorite ? 1 : 0}`;
        btn.classList.toggle("text-secondary", isNowFavorite);
        btn.classList.toggle("text-on-surface-variant", !isNowFavorite);

        Toast.show(
          isNowFavorite ? "Añadido a Favoritos" : "Removido de Guardados",
          isNowFavorite ? `"${title}" guardado en tu biblioteca personal.` : `"${title}" ha sido eliminado de tus marcadores.`,
          isNowFavorite ? "bookmark_added" : "bookmark_remove"
        );
      });
    });
  }

  async function init() {
    categoriaActiva = leerCategoriaDesdeURL();
    try {
      TODAS_LAS_NOTICIAS = await DataService.getNoticias();
      const categorias = [...new Set(TODAS_LAS_NOTICIAS.map((n) => n.categoria))];
      renderPills(categorias);
      aplicarFiltros();
    } catch (err) {
      document.getElementById("cardsGrid").innerHTML = `<p class="font-body-sm text-body-sm text-error">No se pudieron cargar las noticias. Intenta recargar la página.</p>`;
      console.error(err);
    }

    document.getElementById("searchInput").addEventListener("input", aplicarFiltros);
    document.getElementById("sortSelect").addEventListener("change", aplicarFiltros);
    document.getElementById("clearSearchBtn").addEventListener("click", () => {
      document.getElementById("searchInput").value = "";
      aplicarFiltros();
    });
    document.getElementById("resetFiltersBtn").addEventListener("click", resetear);
    document.getElementById("emptyStateResetBtn").addEventListener("click", resetear);
  }

  function resetear() {
    categoriaActiva = "all";
    document.getElementById("searchInput").value = "";
    document.getElementById("sortSelect").value = "reciente";
    const categorias = [...new Set(TODAS_LAS_NOTICIAS.map((n) => n.categoria))];
    renderPills(categorias);
    aplicarFiltros();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
