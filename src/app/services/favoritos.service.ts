import { Injectable, computed, signal } from '@angular/core';

const CLAVE = 'elfaro_favoritos';

/**
 * FavoritosService
 * Guarda los IDs de las noticias favoritas del lector en localStorage.
 * Expone el estado como una señal: cualquier componente que la lea
 * (header, tarjetas, página de favoritos) se actualiza solo al cambiar.
 */
@Injectable({ providedIn: 'root' })
export class FavoritosService {
  private readonly _ids = signal<string[]>(this.leer());

  /** IDs guardados (solo lectura para los componentes). */
  readonly ids = this._ids.asReadonly();
  /** Cantidad de favoritos (se muestra en el badge del header). */
  readonly total = computed(() => this._ids().length);

  constructor() {
    // Sincroniza entre pestañas del navegador.
    window.addEventListener('storage', (e) => {
      if (e.key === CLAVE) this._ids.set(this.leer());
    });
  }

  esFavorito(id: string): boolean {
    return this._ids().includes(id);
  }

  /** Agrega o quita; devuelve true si quedó guardado. */
  alternar(id: string): boolean {
    const guardado = !this.esFavorito(id);
    this.actualizar(guardado ? [...this._ids(), id] : this._ids().filter((x) => x !== id));
    return guardado;
  }

  quitar(id: string): void {
    this.actualizar(this._ids().filter((x) => x !== id));
  }

  vaciar(): void {
    this.actualizar([]);
  }

  private actualizar(ids: string[]): void {
    this._ids.set(ids);
    try {
      localStorage.setItem(CLAVE, JSON.stringify(ids));
    } catch (err) {
      console.error('No se pudo guardar en localStorage', err);
    }
  }

  private leer(): string[] {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) ?? '[]') as string[];
    } catch {
      return [];
    }
  }
}
