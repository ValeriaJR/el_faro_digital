/**
 * Toast
 * Muestra notificaciones flotantes reutilizando un único contenedor
 * fijo (#toastNotification) presente en todas las páginas.
 */
const Toast = (() => {
  let timer = null;

  function show(title, message, icon = "check_circle") {
    const toast = document.getElementById("toastNotification");
    if (!toast) return;
    const toastIcon = document.getElementById("toastIcon");
    const toastTitle = document.getElementById("toastTitle");
    const toastMessage = document.getElementById("toastMessage");

    if (toastIcon) toastIcon.textContent = icon;
    if (toastTitle) toastTitle.textContent = title;
    if (toastMessage) toastMessage.textContent = message;

    toast.classList.remove("translate-y-20", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");

    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      toast.classList.add("translate-y-20", "opacity-0");
      toast.classList.remove("translate-y-0", "opacity-100");
    }, 3200);
  }

  return { show };
})();
