/** Servicio interactivo mostrado en la portada (assets/data/servicios.json). */
export interface Servicio {
  id: string;
  icono: string; // nombre del ícono Material Symbols
  titulo: string;
  descripcion: string;
  cta: string;
  ruta: string; // ruta interna del Router, p. ej. "/explorar"
  queryParams?: Record<string, string>;
}
