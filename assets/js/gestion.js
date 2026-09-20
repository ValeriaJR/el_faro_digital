/**
 * Gestion
 * Controlador de contacto.html: maneja el cambio de pestañas, la
 * validación del formulario de Contacto/Redacción y el CRUD completo
 * del panel de Gestión de Noticias (crear, listar, editar, eliminar).
 */
(function () {
  // ---------- Tabs ----------
  function wireTabs() {
    const tabs = { contact: document.getElementById("tabBtnContact"), crud: document.getElementById("tabBtnCrud") };
    const panels = { contact: document.getElementById("panelContact"), crud: document.getElementById("panelCrud") };

    function activar(nombre) {
      Object.keys(tabs).forEach((key) => {
        const activo = key === nombre;
        tabs[key].classList.toggle("border-secondary", activo);
        tabs[key].classList.toggle("text-secondary", activo);
        tabs[key].classList.toggle("border-transparent", !activo);
        tabs[key].classList.toggle("text-on-surface-variant", !activo);
        panels[key].classList.toggle("hidden", !activo);
        panels[key].classList.toggle("flex", activo);
      });
      if (nombre === "crud") cargarTabla();
    }

    tabs.contact.addEventListener("click", () => activar("contact"));
    tabs.crud.addEventListener("click", () => activar("crud"));
    activar("contact");
  }

  // ---------- Formulario de Contacto ----------
  function wireContactForm() {
    const form = document.getElementById("contactForm");
    const message = document.getElementById("contactMessage");
    const charCount = document.getElementById("contactCharCount");

    message.addEventListener("input", () => {
      charCount.textContent = `${message.value.length} / 500`;
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("contactName").value;
      const email = document.getElementById("contactEmail").value;
      const subject = document.getElementById("contactSubject").value;
      const terms = document.getElementById("contactTerms").checked;

      let valido = true;
      valido = Validate.setFieldError("contactName", Validate.required(name) ? "" : "Ingresa tu nombre completo.") && valido;
      valido =
        Validate.setFieldError("contactEmail", Validate.required(email) && Validate.email(email) ? "" : "Ingresa un correo electrónico válido.") &&
        valido;
      valido = Validate.setFieldError("contactSubject", Validate.required(subject) ? "" : "Selecciona un motivo.") && valido;
      valido =
        Validate.setFieldError(
          "contactMessage",
          Validate.required(message.value) && Validate.minLength(message.value, 20) ? "" : "El mensaje debe tener al menos 20 caracteres."
        ) && valido;
      valido = Validate.setFieldError("contactTerms", terms ? "" : "Debes aceptar la política de privacidad.") && valido;

      if (!valido) return;

      const btn = document.getElementById("contactSubmitBtn");
      const spinner = document.getElementById("contactSpinner");
      const label = document.getElementById("contactSubmitLabel");
      btn.disabled = true;
      spinner.classList.remove("hidden");
      label.textContent = "Enviando...";

      // Simulación de envío (sin backend real)
      setTimeout(() => {
        btn.disabled = false;
        spinner.classList.add("hidden");
        label.textContent = "Enviar mensaje";

        document.getElementById("ticketNumber").textContent = Validate.generarTicket();
        document.getElementById("contactSuccessBanner").classList.remove("hidden");
        document.getElementById("contactSuccessBanner").classList.add("flex");
        Toast.show("Mensaje enviado", "Hemos recibido tu solicitud correctamente.", "task_alt");
        form.reset();
        charCount.textContent = "0 / 500";
      }, 900);
    });
  }

  // ---------- CRUD de Noticias ----------
  let noticiasBase = [];
  let noticiaAEliminar = null;

  async function cargarTabla() {
    const tbody = document.getElementById("crudTableBody");
    const filtro = document.getElementById("crudFilterInput").value.trim().toLowerCase();

    try {
      if (noticiasBase.length === 0) {
        noticiasBase = await DataService.getNoticias();
      }
      const noticias = AdminStore.getMerged(noticiasBase).filter((n) => n.titulo.toLowerCase().includes(filtro));

      const emptyState = document.getElementById("crudEmptyState");
      if (noticias.length === 0) {
        tbody.innerHTML = "";
        emptyState.classList.remove("hidden");
        emptyState.classList.add("flex");
        return;
      }
      emptyState.classList.add("hidden");
      emptyState.classList.remove("flex");

      tbody.innerHTML = noticias
        .map(
          (n) => `
        <tr class="border-t border-surface-container-low hover:bg-surface-container-low/60 transition-colors">
          <td class="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface max-w-xs truncate">${n.titulo}</td>
          <td class="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">${n.categoria}</td>
          <td class="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">${n.autor}</td>
          <td class="px-space-md py-space-sm font-body-sm text-body-sm text-on-surface-variant">${n.fecha}</td>
          <td class="px-space-md py-space-sm text-right">
            <div class="flex items-center justify-end gap-space-xxs">
              <a class="p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface" href="noticia.html?id=${n.id}" target="_blank" title="Ver">
                <span class="material-symbols-outlined text-[18px]">visibility</span>
              </a>
              <button class="edit-news-btn p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface" data-id="${n.id}" title="Editar">
                <span class="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button class="delete-news-btn p-1.5 rounded-lg hover:bg-error-container text-on-surface-variant hover:text-on-error-container" data-id="${n.id}" title="Eliminar">
                <span class="material-symbols-outlined text-[18px]">delete</span>
              </button>
            </div>
          </td>
        </tr>`
        )
        .join("");

      tbody.querySelectorAll(".edit-news-btn").forEach((btn) => btn.addEventListener("click", () => abrirFormulario(btn.getAttribute("data-id"))));
      tbody.querySelectorAll(".delete-news-btn").forEach((btn) =>
        btn.addEventListener("click", () => {
          noticiaAEliminar = btn.getAttribute("data-id");
          document.getElementById("deleteConfirmModal").classList.remove("hidden");
          document.getElementById("deleteConfirmModal").classList.add("flex");
        })
      );
    } catch (err) {
      tbody.innerHTML = `<tr><td colspan="5" class="px-space-md py-space-md text-error font-body-sm text-body-sm">No se pudieron cargar las noticias.</td></tr>`;
      console.error(err);
    }
  }

  function abrirFormulario(id) {
    const modal = document.getElementById("newsFormModal");
    const form = document.getElementById("newsForm");
    form.reset();
    ["newsTitle", "newsAuthor", "newsImage", "newsSummary", "newsContent"].forEach((f) => Validate.setFieldError(f, ""));

    if (id) {
      const noticia = AdminStore.getMerged(noticiasBase).find((n) => n.id === id);
      document.getElementById("newsFormTitle").textContent = "Editar noticia";
      document.getElementById("newsId").value = id;
      document.getElementById("newsTitle").value = noticia.titulo;
      document.getElementById("newsCategory").value = noticia.categoria;
      document.getElementById("newsAuthor").value = noticia.autor;
      document.getElementById("newsImage").value = noticia.imagen;
      document.getElementById("newsSummary").value = noticia.resumen;
      document.getElementById("newsContent").value = (noticia.contenido || []).join("\n");
    } else {
      document.getElementById("newsFormTitle").textContent = "Nueva noticia";
      document.getElementById("newsId").value = "";
    }

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function cerrarFormulario() {
    document.getElementById("newsFormModal").classList.add("hidden");
    document.getElementById("newsFormModal").classList.remove("flex");
  }

  function wireNewsForm() {
    document.getElementById("btnNewNews").addEventListener("click", () => abrirFormulario(null));
    document.getElementById("btnCloseNewsForm").addEventListener("click", cerrarFormulario);
    document.getElementById("btnCancelNewsForm").addEventListener("click", cerrarFormulario);
    document.getElementById("crudFilterInput").addEventListener("input", cargarTabla);

    document.getElementById("newsForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const id = document.getElementById("newsId").value;
      const titulo = document.getElementById("newsTitle").value;
      const autor = document.getElementById("newsAuthor").value;
      const imagen = document.getElementById("newsImage").value;
      const resumen = document.getElementById("newsSummary").value;
      const contenidoRaw = document.getElementById("newsContent").value;

      let valido = true;
      valido = Validate.setFieldError("newsTitle", Validate.required(titulo) && Validate.minLength(titulo, 8) ? "" : "El título debe tener al menos 8 caracteres.") && valido;
      valido = Validate.setFieldError("newsAuthor", Validate.required(autor) ? "" : "Ingresa el autor.") && valido;
      valido = Validate.setFieldError("newsImage", Validate.required(imagen) ? "" : "Ingresa la URL de una imagen.") && valido;
      valido = Validate.setFieldError("newsSummary", Validate.required(resumen) && Validate.minLength(resumen, 20) ? "" : "El resumen debe tener al menos 20 caracteres.") && valido;
      valido = Validate.setFieldError("newsContent", Validate.required(contenidoRaw) ? "" : "Ingresa el contenido de la noticia.") && valido;

      if (!valido) return;

      const datos = {
        titulo,
        categoria: document.getElementById("newsCategory").value,
        autor,
        imagen,
        resumen,
        contenido: contenidoRaw.split("\n").map((p) => p.trim()).filter(Boolean),
        fecha: new Date().toISOString().slice(0, 10),
        tiempoLectura: Math.max(1, Math.round(contenidoRaw.split(/\s+/).length / 200))
      };

      if (id) {
        AdminStore.update(id, datos);
        Toast.show("Noticia actualizada", `"${titulo}" se guardó correctamente.`, "task_alt");
      } else {
        AdminStore.create(datos);
        Toast.show("Noticia creada", `"${titulo}" se publicó en el catálogo.`, "task_alt");
      }

      cerrarFormulario();
      cargarTabla();
    });
  }

  function wireDeleteModal() {
    document.getElementById("btnCancelDelete").addEventListener("click", () => {
      noticiaAEliminar = null;
      document.getElementById("deleteConfirmModal").classList.add("hidden");
      document.getElementById("deleteConfirmModal").classList.remove("flex");
    });
    document.getElementById("btnConfirmDelete").addEventListener("click", () => {
      if (noticiaAEliminar) {
        AdminStore.remove(noticiaAEliminar);
        FavoritesStore.remove(noticiaAEliminar);
        Toast.show("Noticia eliminada", "El artículo se eliminó del catálogo.", "delete_sweep");
      }
      noticiaAEliminar = null;
      document.getElementById("deleteConfirmModal").classList.add("hidden");
      document.getElementById("deleteConfirmModal").classList.remove("flex");
      cargarTabla();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireTabs();
    wireContactForm();
    wireNewsForm();
    wireDeleteModal();
  });
})();
