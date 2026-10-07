# El Faro Digital (Angular)

Periódico digital desarrollado en **Angular 22** con componentes, data binding, servicios, enrutamiento y formularios reactivos.
Entrega final — Asignatura Frontend, Politécnico Grancolombiano.

- **Autora:** Valeria Jiménez Rodríguez
- **Docente:** John Olarte
- **Sitio desplegado:** _https://el-faro-digital.netlify.app/_
- **Video explicativo:** _(pegar aquí el enlace de YouTube)_

## Requisitos
- **Node.js** `^22.22.3`, `^24.15.0` o superior (recomendado: Node 24 LTS). 

## Ejecutar en local
```bash
npm install
npm start          # y
```
Otros comandos: `npm run build` (producción → `dist/el-faro-angular/browser`) · `npm test` (pruebas automáticas, 9 casos).

## Imágenes
Las 7 imágenes se guardan en `public/assets/img/`

## Qué hay en cada parte
| Carpeta | Contenido |
|---|---|
| `src/app/components/` | `header`, `footer`, `toast`, `news-card`, `servicio-card`, `favorito-item` |
| `src/app/pages/` | `inicio`, `explorar`, `noticia` (detalle), `favoritos`, `contacto` (contacto + gestión CRUD) |
| `src/app/services/` | `noticias` (HttpClient + JSON), `favoritos` (localStorage), `admin` (CRUD en localStorage), `toast` |
| `src/app/models/` | Interfaces TypeScript `Noticia`, `Servicio` |
| `public/assets/data/` | `noticias.json`, `servicios.json` (fuente de datos) |

## Conceptos de Angular aplicados
- **Componentes standalone** y composición (`<app-news-card [noticia]="n" />`).
- **Data binding:** interpolación `{{ }}`, de propiedad `[src]`, `[class.x]`, de eventos `(click)`, `(ngSubmit)` y bidireccional `[(ngModel)]`.
- **Control de flujo** `@if`, `@for`, `@empty`, `@else`.
- **Comunicación entre componentes:** `input()` / `output()`.
- **Servicios e inyección de dependencias** (`inject()`), con **signals** (`signal`, `computed`) como estado reactivo.
- **Router:** rutas con carga diferida, parámetro `:id` enlazado a `input()`, query params (`?categoria=`, `?q=`).
- **Formularios reactivos** con validadores (`required`, `email`, `minLength`, `pattern`, `requiredTrue`).
- **Pipes:** `date` (en español), `number`.
- **HttpClient** para leer los JSON.

## Despliegue (Netlify)
Build command: `npm run build` · Publish directory: `dist/el-faro-angular/browser` (ya definido en `netlify.toml`, junto con `NODE_VERSION=24` y la redirección para las rutas de Angular).

## Notas
- Los datos de clima y dólar del encabezado son simulados.
- Los favoritos y los cambios del panel de gestión se guardan en el `localStorage` del navegador (no hay backend).
- Tailwind CSS se carga por CDN en `src/index.html`.
