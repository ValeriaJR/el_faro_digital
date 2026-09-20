/**
 * Render
 * Funciones puras que devuelven HTML (string) a partir de los objetos
 * JSON de noticias y servicios. Se usan en index.html, explorar.html y
 * favoritos.html para pintar tarjetas dinámicamente.
 */
const Render = (() => {
  function formatFecha(fechaISO) {
    const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
    const [y, m, d] = fechaISO.split("-").map(Number);
    return `${d} ${meses[m - 1]} ${y}`;
  }

  function newsCard(noticia) {
    const activa = FavoritesStore.isFavorite(noticia.id);
    return `
      <article class="news-card bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group" data-id="${noticia.id}" data-categoria="${noticia.categoria}">
        <div>
          <div class="relative h-48 w-full overflow-hidden bg-surface-container">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${noticia.titulo}" src="${noticia.imagen}"/>
            <div class="absolute top-3 left-3 flex items-center gap-1">
              <span class="px-2.5 py-0.5 rounded-full font-label-caps text-label-caps uppercase ${noticia.colorBadge} font-bold">${noticia.categoria}</span>
            </div>
            <button class="card-fav-btn absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-sm flex items-center justify-center transition-colors ${activa ? "text-secondary" : "text-on-surface-variant hover:text-secondary"}" data-id="${noticia.id}" data-title="${noticia.titulo}" aria-label="Guardar en favoritos" title="Guardar en favoritos">
              <span class="material-symbols-outlined text-[18px]" style="font-variation-settings: 'FILL' ${activa ? 1 : 0}">${activa ? "favorite" : "favorite_border"}</span>
            </button>
          </div>
          <div class="p-space-md flex flex-col gap-space-xs">
            <div class="flex items-center justify-between font-byline-meta text-byline-meta text-on-surface-variant">
              <span>${formatFecha(noticia.fecha)}</span>
              <span>${noticia.autor}</span>
            </div>
            <h3 class="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors line-clamp-2">${noticia.titulo}</h3>
            <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-3 mt-1">${noticia.resumen}</p>
          </div>
        </div>
        <div class="p-space-md pt-0 flex items-center justify-between">
          <a class="font-label-md text-label-md text-secondary font-semibold hover:underline flex items-center gap-1" href="noticia.html?id=${noticia.id}">
            Ver más <span class="material-symbols-outlined text-[16px]">chevron_right</span>
          </a>
          <span class="font-byline-meta text-byline-meta text-on-surface-variant">${noticia.tiempoLectura} min</span>
        </div>
      </article>`;
  }

  function favoriteListItem(noticia) {
    return `
      <article class="article-item bg-surface-container-lowest p-space-md md:p-space-lg rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-space-lg items-start md:items-center justify-between" data-categoria="${noticia.categoria}" data-id="${noticia.id}" data-tiempo="${noticia.tiempoLectura}" data-titulo="${noticia.titulo.toLowerCase()}">
        <div class="flex flex-col sm:flex-row gap-space-md items-start sm:items-center w-full md:w-auto flex-1">
          <div class="relative w-full sm:w-44 h-28 rounded-lg overflow-hidden shrink-0 bg-surface-container">
            <img class="w-full h-full object-cover" alt="${noticia.titulo}" src="${noticia.imagen}"/>
          </div>
          <div class="flex flex-col gap-space-xxs flex-1 min-w-0">
            <div class="flex items-center gap-space-xs flex-wrap font-byline-meta text-byline-meta text-on-surface-variant">
              <span class="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-semibold">${noticia.categoria}</span>
              <span>•</span>
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">timer</span>${noticia.tiempoLectura} min lectura</span>
            </div>
            <h2 class="font-headline-md text-headline-md text-on-surface font-semibold hover:text-secondary transition-colors cursor-pointer line-clamp-2">${noticia.titulo}</h2>
            <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${noticia.resumen}</p>
          </div>
        </div>
        <div class="flex items-center justify-between md:justify-end gap-space-sm w-full md:w-auto shrink-0 pt-space-xs md:pt-0">
          <a class="px-space-md py-space-xs bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors flex items-center gap-1" href="noticia.html?id=${noticia.id}">
            <span>Leer ahora</span>
            <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
          </a>
          <button class="delete-fav-btn p-2 rounded-lg bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors flex items-center justify-center" data-id="${noticia.id}" title="Eliminar de favoritos">
            <span class="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </article>`;
  }

  function serviceCard(servicio) {
    return `
      <a class="bg-surface-container-lowest p-space-md rounded-xl hover:bg-surface-container-highest transition-all shadow-sm flex flex-col gap-space-sm group" href="${servicio.enlace}">
        <div class="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-on-primary transition-colors">
          <span class="material-symbols-outlined text-[24px]">${servicio.icono}</span>
        </div>
        <div class="flex flex-col">
          <h4 class="font-label-md text-label-md text-on-surface font-semibold">${servicio.titulo}</h4>
          <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${servicio.descripcion}</p>
        </div>
        <span class="font-byline-meta text-byline-meta text-secondary font-medium mt-auto pt-space-xs flex items-center gap-1">
          ${servicio.cta} <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
        </span>
      </a>`;
  }

  return { formatFecha, newsCard, favoriteListItem, serviceCard };
})();
