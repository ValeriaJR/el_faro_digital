import { Injectable, signal } from '@angular/core';
import { Noticia, NoticiaForm } from '../models/noticia';

const CLAVE = 'elfaro_admin_overrides';

interface Cambios {
  agregadas: Noticia[];
  editadas: Record<string, Noticia>;
  eliminadas: string[];
}

/**
 * AdminService
 * Simula el backend del panel de gestión: el JSON base es de solo lectura y las
 * altas, ediciones y bajas se guardan como "cambios" en localStorage.
 * NoticiasService combina el JSON con estos cambios.
 */
@Injectable({ providedIn: 'root' })
export class AdminService {
  readonly cambios = signal<Cambios>(this.leer());

  /** Aplica los cambios sobre la lista base del JSON. */
  aplicar(base: Noticia[]): Noticia[] {
    const c = this.cambios();
    const vigentes = base.filter((n) => !c.eliminadas.includes(n.id)).map((n) => c.editadas[n.id] ?? n);
    return [...vigentes, ...c.agregadas];
  }

  crear(datos: NoticiaForm): Noticia {
    const nueva: Noticia = {
      ...datos,
      id: this.generarId(datos.titulo),
      colorBadge: 'bg-surface-container text-on-surface',
      fecha: new Date().toISOString().slice(0, 10),
      tiempoLectura: this.tiempoLectura(datos.contenido),
      vistas: 0,
      destacada: false,
    };
    this.guardar({ ...this.cambios(), agregadas: [...this.cambios().agregadas, nueva] });
    return nueva;
  }

  actualizar(original: Noticia, datos: NoticiaForm): void {
    const modificada: Noticia = { ...original, ...datos, tiempoLectura: this.tiempoLectura(datos.contenido) };
    const c = this.cambios();
    if (c.agregadas.some((n) => n.id === original.id)) {
      this.guardar({ ...c, agregadas: c.agregadas.map((n) => (n.id === original.id ? modificada : n)) });
    } else {
      this.guardar({ ...c, editadas: { ...c.editadas, [original.id]: modificada } });
    }
  }

  eliminar(id: string): void {
    const c = this.cambios();
    if (c.agregadas.some((n) => n.id === id)) {
      this.guardar({ ...c, agregadas: c.agregadas.filter((n) => n.id !== id) });
    } else {
      const { [id]: _quitada, ...editadas } = c.editadas;
      this.guardar({ ...c, editadas, eliminadas: [...c.eliminadas, id] });
    }
  }

  private tiempoLectura(parrafos: string[]): number {
    return Math.max(1, Math.round(parrafos.join(' ').split(/\s+/).length / 200));
  }

  private generarId(titulo: string): string {
    const base = titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return `${base}-${Date.now().toString(36)}`;
  }

  private guardar(c: Cambios): void {
    this.cambios.set(c);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(c));
    } catch (err) {
      console.error('No se pudo guardar el panel de gestión', err);
    }
  }

  private leer(): Cambios {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) return JSON.parse(raw) as Cambios;
    } catch {
      /* se ignora y se parte de cero */
    }
    return { agregadas: [], editadas: {}, eliminadas: [] };
  }
}
