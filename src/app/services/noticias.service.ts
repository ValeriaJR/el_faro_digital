import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Noticia } from '../models/noticia';
import { Servicio } from '../models/servicio';
import { AdminService } from './admin.service';

/**
 * NoticiasService
 * Carga los JSON con HttpClient y expone las noticias como señales.
 * `noticias` = JSON base + cambios del panel de gestión (AdminService),
 * por eso se recalcula sola cuando se crea, edita o elimina una noticia.
 */
@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly http = inject(HttpClient);
  private readonly admin = inject(AdminService);

  private readonly base = signal<Noticia[]>([]);

  readonly servicios = signal<Servicio[]>([]);
  readonly cargando = signal(true);
  readonly error = signal(false);

  readonly noticias = computed(() => this.admin.aplicar(this.base()));
  readonly categorias = computed(() => [...new Set(this.noticias().map((n) => n.categoria))]);

  constructor() {
    this.cargar();
  }

  porId(id: string | undefined): Noticia | undefined {
    return this.noticias().find((n) => n.id === id);
  }

  relacionadas(noticia: Noticia, limite = 3): Noticia[] {
    return this.noticias()
      .filter((n) => n.id !== noticia.id && n.categoria === noticia.categoria)
      .slice(0, limite);
  }

  private cargar(): void {
    this.http.get<Noticia[]>('assets/data/noticias.json').subscribe({
      next: (datos) => {
        this.base.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
      },
    });
    this.http.get<Servicio[]>('assets/data/servicios.json').subscribe({
      next: (datos) => this.servicios.set(datos),
      error: () => this.error.set(true),
    });
  }
}
