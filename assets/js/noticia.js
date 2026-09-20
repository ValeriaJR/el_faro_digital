/**
 * Noticia
 * Controlador de noticia.html: lee el parámetro ?id= de la URL, busca el
 * artículo correspondiente en el JSON y lo renderiza, junto con noticias
 * relacionadas de la misma categoría.
 */
(function () {
  function idDesdeURL() {
    return new URLSearchParams(window.location.search).get("id");
  }

  function wireFavoriteButton(noticia) {
    const btn = document.getElementById("articleFavBtn");
    if (!btn) return;
    const icon = document.getElementById("articleFavIcon");
    const label = document.getElementById("articleFavLabel");

    function pintarEstado() {
      const activa = FavoritesStore.isFavorite(noticia.id);
      icon.textContent = activa ? "favorite" : "favorite_border";
      icon.style.fontVariationSettings = `'FILL' ${activa ? 1 : 0}`;
      btn.classList.toggle("bg-secondary", activa);
      btn.classList.toggle("text-on-secondary", activa);
      btn.classList.toggle("bg-surface-container", !activa);
      btn.classList.toggle("text-on-surface", !activa);
      if (label) label.textContent = activa ? "Guardado" : "Guardar";
    }

    btn.addEventListener("click", () => {
      const isNowFavorite = FavoritesStore.toggle(noticia.id);
      pintarEstado();
      Toast.show(
        isNowFavorite ? "Artículo Guardado" : "Eliminado de Favoritos",
        isNowFavorite ? `«${noticia.titulo}» está disponible en tu biblioteca.` : "El artículo se retiró de tus guardados.",
        isNowFavorite ? "bookmark_added" : "bookmark_remove"
      );
    });

    pintarEstado();
  }

  function renderArticulo(noticia) {
    document.title = `${noticia.titulo} · El Faro Digital`;
    document.getElementById("breadcrumbCategoria").textContent = noticia.categoria;

    const container = document.getElementById("articleContainer");
    container.innerHTML = `
      <div class="flex flex-col gap-space-xs">
        <span class="w-fit px-2.5 py-0.5 rounded-full font-label-caps text-label-caps uppercase ${noticia.colorBadge} font-bold">${noticia.categoria}</span>
        <h1 class="font-headline-lg text-headline-lg text-on-surface tracking-tight">${noticia.titulo}</h1>
        <div class="flex items-center gap-space-sm font-byline-meta text-byline-meta text-on-surface-variant flex-wrap">
          <span class="font-medium text-on-surface">${noticia.autor}</span>
          <span>•</span>
          <span>${Render.formatFecha(noticia.fecha)}</span>
          <span>•</span>
          <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">timer</span>${noticia.tiempoLectura} min de lectura</span>
          <span>•</span>
          <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">visibility</span>${noticia.vistas.toLocaleString("es-CO")} vistas</span>
        </div>
      </div>
      <div class="w-full h-72 md:h-[420px] rounded-xl overflow-hidden bg-surface-container">
        <img class="w-full h-full object-cover" alt="${noticia.titulo}" src="${noticia.imagen}"/>
      </div>
      <div class="flex items-center gap-space-sm">
        <button class="flex items-center gap-space-xs px-space-md py-space-xs rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md text-label-md transition-colors" id="articleFavBtn">
          <span class="material-symbols-outlined text-[18px]" id="articleFavIcon">favorite_border</span>
          <span id="articleFavLabel">Guardar</span>
        </button>
      </div>
      <div class="font-body-lead text-body-lead text-on-surface flex flex-col gap-space-md" id="articleBody">
        ${noticia.contenido.map((p) => `<p>${p}</p>`).join("")}
      </div>`;

    wireFavoriteButton(noticia);
  }

  async function renderRelacionadas(noticia) {
    const grid = document.getElementById("relatedGrid");
    const section = document.getElementById("relatedSection");
    try {
      const relacionadas = await DataService.getRelacionadas(noticia.id, noticia.categoria, 3);
      if (relacionadas.length === 0) {
        section.classList.add("hidden");
        return;
      }
      grid.innerHTML = relacionadas.map(Render.newsCard).join("");
      grid.querySelectorAll(".card-fav-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const id = btn.getAttribute("data-id");
          const isNowFavorite = FavoritesStore.toggle(id);
          const icon = btn.querySelector(".material-symbols-outlined");
          icon.textContent = isNowFavorite ? "favorite" : "favorite_border";
          btn.classList.toggle("text-secondary", isNowFavorite);
        });
      });
    } catch (err) {
      section.classList.add("hidden");
      console.error(err);
    }
  }

  async function init() {
    const id = idDesdeURL();
    const container = document.getElementById("articleContainer");
    const notFound = document.getElementById("notFoundState");

    if (!id) {
      container.classList.add("hidden");
      notFound.classList.remove("hidden");
      notFound.classList.add("flex");
      document.getElementById("relatedSection").classList.add("hidden");
      return;
    }

    try {
      const noticia = await DataService.getNoticiaPorId(id);
      if (!noticia) {
        container.classList.add("hidden");
        notFound.classList.remove("hidden");
        notFound.classList.add("flex");
        document.getElementById("relatedSection").classList.add("hidden");
        return;
      }
      renderArticulo(noticia);
      renderRelacionadas(noticia);
    } catch (err) {
      container.innerHTML = `<p class="font-body-sm text-body-sm text-error">Ocurrió un error al cargar el artículo.</p>`;
      console.error(err);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
