/**
 * Nav
 * Se ejecuta en todas las páginas: resalta el enlace activo del menú
 * según `data-page` en <body>, y mantiene sincronizado el contador de
 * favoritos del header con FavoritesStore.
 */
(function () {
  function highlightActiveLink() {
    const currentPage = document.body.getAttribute("data-page");
    document.querySelectorAll("nav a[data-path]").forEach((link) => {
      const isActive = link.getAttribute("data-path") === currentPage;
      link.classList.toggle("bg-surface-container-high", isActive);
      link.classList.toggle("text-on-surface", isActive);
      link.classList.toggle("font-semibold", isActive);
      link.classList.toggle("text-on-surface-variant", !isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function updateFavoritesBadge() {
    const count = FavoritesStore.count();
    document.querySelectorAll(".fav-badge").forEach((badge) => {
      badge.textContent = count;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    highlightActiveLink();
    updateFavoritesBadge();
    FavoritesStore.onChange(updateFavoritesBadge);
  });
})();
