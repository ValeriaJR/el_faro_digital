/** Noticia tal como viene del JSON (assets/data/noticias.json). */
export interface Noticia {
  id: string;
  categoria: string;
  colorBadge: string;
  titulo: string;
  resumen: string;
  contenido: string[];
  autor: string;
  fecha: string; // ISO yyyy-mm-dd
  tiempoLectura: number; // minutos
  imagen: string;
  destacada: boolean;
  vistas: number;
}

/** Datos del formulario de creación/edición (panel de gestión). */
export type NoticiaForm = Pick<Noticia, 'titulo' | 'categoria' | 'autor' | 'imagen' | 'resumen' | 'contenido'>;
