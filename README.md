# El Faro Digital

Sitio web funcional para el periódico digital **El Faro Digital**, construido con **HTML, CSS (Tailwind CDN) y JavaScript puro (vanilla)**, sin frameworks ni pasos de compilación. Listo para publicarse como sitio estático.

## ✨ Funcionalidades implementadas

- **Renderizado dinámico desde JSON**: las noticias (`assets/data/noticias.json`) y los servicios interactivos (`assets/data/servicios.json`) se cargan con `fetch` y se pintan en el DOM en tiempo de ejecución (portada, catálogo, detalle y favoritos).
- **Favoritos persistentes**: un módulo (`assets/js/storage.js`) guarda los IDs de las noticias marcadas como favoritas en `localStorage`, sincronizado entre todas las páginas y pestañas del navegador (badge del header, página "Mis Favoritos").
- **Catálogo con filtros**: búsqueda por texto, filtro por categoría y ordenamiento (recientes, antiguas, lectura corta, más vistas) en `explorar.html`.
- **Detalle de noticia**: `noticia.html?id=<id>` carga el artículo correspondiente y sugiere noticias relacionadas de la misma categoría.
- **Formularios con validación**:
  - Newsletter (portada): valida formato de correo.
  - Contacto/Redacción (`contacto.html`): valida nombre, correo, motivo, longitud del mensaje y aceptación de términos; simula el envío y genera un número de radicado.
  - Gestión de Noticias (CRUD): formulario de creación/edición con validaciones de longitud mínima y campos obligatorios.
- **Panel de Gestión de Noticias (CRUD)**: tabla con búsqueda, crear, editar, ver y eliminar noticias. Los cambios se guardan como "overrides" en `localStorage` (`assets/js/admin-store.js`) sin modificar el archivo JSON original.
- **Código estructurado**: HTML separado por página, JS modular por responsabilidad (`storage`, `toast`, `data-service`, `render`, `validate`, `nav`, `admin-store` + un controlador por página).

## 📁 Estructura del proyecto

```
el-faro-digital/
├── index.html            Portada principal
├── explorar.html         Catálogo de noticias con filtros/búsqueda
├── noticia.html          Detalle de una noticia (?id=)
├── favoritos.html        Biblioteca personal de guardados
├── contacto.html         Contacto/Redacción + Gestión de Noticias (CRUD)
├── assets/
│   ├── css/style.css             Estilos base compartidos
│   ├── data/
│   │   ├── noticias.json         Fuente de datos de noticias
│   │   └── servicios.json        Fuente de datos de servicios interactivos
│   └── js/
│       ├── tailwind-config.js    Tokens de diseño (colores, tipografías, espaciados)
│       ├── storage.js            Favoritos (localStorage)
│       ├── admin-store.js        CRUD de noticias (localStorage)
│       ├── toast.js              Notificaciones flotantes
│       ├── data-service.js       Acceso a los JSON (fetch + caché)
│       ├── render.js             Plantillas HTML (tarjetas de noticia/servicio)
│       ├── validate.js           Reglas de validación de formularios
│       ├── nav.js                Estado activo del menú + badge de favoritos
│       ├── home.js               Controlador de index.html
│       ├── explorar.js           Controlador de explorar.html
│       ├── noticia.js            Controlador de noticia.html
│       ├── favoritos.js          Controlador de favoritos.html
│       └── gestion.js            Controlador de contacto.html
└── build/                 Fragmentos HTML fuente + script de ensamblado
    ├── head_common.html, header.html, footer.html, content_*.html
    └── assemble.py        Regenera los 5 .html finales a partir de los fragmentos
```

## 🚀 Cómo ejecutarlo localmente

```bash
# Opción 1: con Python
python3 -m http.server 8080

# Opción 2: con Node
npx serve .
```

Luego visita `http://localhost:8080/el-faro-digital/` o  `http://localhost:8080` según versión.
