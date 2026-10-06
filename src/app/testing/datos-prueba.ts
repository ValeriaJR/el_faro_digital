import { Noticia } from '../models/noticia';
import { Servicio } from '../models/servicio';

/** Datos mínimos para las pruebas (no dependen de los JSON reales). */
export const NOTICIAS_PRUEBA: Noticia[] = [
  { id: 'a', categoria: 'Tecnología', colorBadge: '', titulo: 'Noticia A de tecnología', resumen: 'Resumen A', contenido: ['p1', 'p2'], autor: 'Ana', fecha: '2026-10-04', tiempoLectura: 4, imagen: 'assets/img/noticias/tecnologia.jpg', destacada: true, vistas: 1500 },
  { id: 'b', categoria: 'Turismo', colorBadge: '', titulo: 'Noticia B de turismo', resumen: 'Resumen B', contenido: ['p1'], autor: 'Beto', fecha: '2026-10-03', tiempoLectura: 6, imagen: 'assets/img/noticias/turismo-cafe.jpg', destacada: false, vistas: 900 },
  { id: 'c', categoria: 'Tecnología', colorBadge: '', titulo: 'Noticia C de tecnología', resumen: 'Resumen C', contenido: ['p1'], autor: 'Cami', fecha: '2026-10-02', tiempoLectura: 3, imagen: 'assets/img/noticias/tecnologia.jpg', destacada: false, vistas: 300 },
];

export const SERVICIOS_PRUEBA: Servicio[] = [
  { id: 's1', icono: 'manage_search', titulo: 'Buscador', descripcion: 'Desc', cta: 'Ir', ruta: '/explorar' },
];
