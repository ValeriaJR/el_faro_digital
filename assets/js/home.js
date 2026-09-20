/**
 * Home
 * Controlador de index.html: pinta el hero, el grid de noticias destacadas
 * y el grid de servicios a partir de los JSON, y valida el formulario de
 * newsletter.
 */
(function () {
  async function renderHero() {
    const container = document.getElementById("heroContainer");
    try {
      const noticias = await DataService.getNoticias();
      const destacada = noticias.find((n) => n.destacada) || noticias[0];
      const secundaria = noticias.find((n) => n.id !== destacada.id) || noticias[1];

      container.innerHTML = `
        <div class="lg:col-span-8 bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row group">
          <div class="md:w-1/2 h-64 md:h-auto overflow-hidden">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="${destacada.titulo}" src="${destacada.imagen}"/>
          </div>
          <div class="md:w-1/2 p-space-lg md:p-space-2xl flex flex-col justify-between gap-space-md">
            <div class="flex flex-col gap-space-sm">
              <span class="w-fit px-2.5 py-0.5 rounded-full font-label-caps text-label-caps uppercase ${destacada.colorBadge} font-bold">${destacada.categoria}</span>
              <h1 class="font-headline-lead text-headline-lead-mobile lg:text-headline-lead text-on-surface tracking-tight">${destacada.titulo}</h1>
              <p class="font-body-lead text-body-lead text-on-surface-variant line-clamp-3">${destacada.resumen}</p>
            </div>
            <div class="flex items-center justify-between">
              <a class="px-space-md py-space-xs bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:bg-primary-container transition-colors flex items-center gap-1" href="noticia.html?id=${destacada.id}">
                Leer reportaje completo <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
              </a>
              <span class="font-byline-meta text-byline-meta text-on-surface-variant">${destacada.tiempoLectura} min</span>
            </div>
          </div>
        </div>
        <div class="lg:col-span-4 flex flex-col gap-space-md">
          <div class="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm flex flex-col flex-1">
            <div class="relative h-56 w-full">
              <img class="w-full h-full object-cover" alt="${secundaria.titulo}" src="${secundaria.imagen}"/>
            </div>
            <div class="p-space-md flex flex-col justify-between flex-1 gap-space-sm">
              <div class="flex flex-col gap-space-xxs">
                <span class="font-label-caps text-label-caps text-secondary uppercase tracking-widest">${secundaria.categoria}</span>
                <h3 class="font-headline-sm text-headline-sm text-on-surface">${secundaria.titulo}</h3>
                <p class="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">${secundaria.resumen}</p>
              </div>
              <a class="font-label-md text-label-md text-secondary font-semibold hover:underline flex items-center gap-1" href="noticia.html?id=${secundaria.id}">
                Ver más <span class="material-symbols-outlined text-[16px]">chevron_right</span>
              </a>
            </div>
          </div>
        </div>`;
    } catch (err) {
      container.innerHTML = `<p class="lg:col-span-12 font-body-sm text-body-sm text-error">No se pudo cargar la edición principal. Intenta recargar la página.</p>`;
      console.error(err);
    }
  }

  async function renderFeaturedGrid() {
    const grid = document.getElementById("featuredGrid");
    try {
      const noticias = await DataService.getNoticias();
      grid.innerHTML = noticias.slice(0, 4).map(Render.newsCard).join("");
      wireFavoriteButtons(grid);
    } catch (err) {
      grid.innerHTML = `<p class="font-body-sm text-body-sm text-error">No se pudieron cargar las noticias.</p>`;
      console.error(err);
    }
  }

  async function renderServices() {
    const grid = document.getElementById("servicesGrid");
    try {
      const servicios = await DataService.getServicios();
      grid.innerHTML = servicios.map(Render.serviceCard).join("");
    } catch (err) {
      grid.innerHTML = `<p class="font-body-sm text-body-sm text-error">No se pudieron cargar los servicios.</p>`;
      console.error(err);
    }
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

        if (isNowFavorite) {
          Toast.show("Añadido a Favoritos", `"${title}" guardado en tu biblioteca personal.`, "bookmark_added");
        } else {
          Toast.show("Removido de Guardados", `"${title}" ha sido eliminado de tus marcadores.`, "bookmark_remove");
        }
      });
    });
  }

  function wireNewsletterForm() {
    const form = document.getElementById("newsletterForm");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("subscriberEmail");
      const name = document.getElementById("subscriberName");
      const successBox = document.getElementById("newsletterSuccess");

      const emailValid =
        Validate.required(email.value) && Validate.email(email.value)
          ? Validate.setFieldError("subscriberEmail", "")
          : Validate.setFieldError("subscriberEmail", "Ingresa un correo electrónico válido.");

      if (!emailValid) return;

      successBox.classList.remove("hidden");
      Toast.show("¡Suscripción Exitosa!", `Te hemos añadido a la lista, ${name.value.trim() || "lector"}.`, "mark_email_read");
      form.reset();
      setTimeout(() => successBox.classList.add("hidden"), 4000);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderHero();
    renderFeaturedGrid();
    renderServices();
    wireNewsletterForm();
  });
})();
