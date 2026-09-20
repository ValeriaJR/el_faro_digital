/**
 * Validate
 * Reglas de validación genéricas usadas por los formularios de
 * Contacto/Redacción y Gestión de Noticias.
 */
const Validate = (() => {
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function required(value) {
    return value !== null && value !== undefined && String(value).trim().length > 0;
  }

  function email(value) {
    return EMAIL_RE.test(String(value).trim());
  }

  function minLength(value, min) {
    return String(value || "").trim().length >= min;
  }

  function maxLength(value, max) {
    return String(value || "").trim().length <= max;
  }

  /**
   * Muestra u oculta el mensaje de error asociado a un campo.
   * Espera que exista un elemento con id `${fieldId}-error`.
   */
  function setFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}-error`);
    if (errorEl) {
      errorEl.textContent = message || "";
      errorEl.classList.toggle("hidden", !message);
    }
    if (field) {
      field.classList.toggle("border-error", Boolean(message));
      field.classList.toggle("ring-error", Boolean(message));
    }
    return !message;
  }

  function generarTicket() {
    const n = Math.floor(100000 + Math.random() * 900000);
    return `EFD-${n}`;
  }

  return { required, email, minLength, maxLength, setFieldError, generarTicket };
})();
