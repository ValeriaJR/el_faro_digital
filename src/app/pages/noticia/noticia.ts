import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NewsCard } from '../../components/news-card/news-card';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';
import { ToastService } from '../../services/toast.service';

/**
 * Detalle de noticia. El parámetro :id de la ruta llega como input() gracias a
 * withComponentInputBinding(); la noticia se obtiene con una señal computada.
 */
@Component({
  selector: 'app-noticia-detalle',
  imports: [RouterLink, NewsCard, DatePipe, DecimalPipe],
  templateUrl: './noticia.html',
})
export class NoticiaDetalle {
  readonly id = input.required<string>();

  protected readonly datos = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  protected readonly noticia = computed(() => this.datos.porId(this.id()));
  protected readonly relacionadas = computed(() => {
    const n = this.noticia();
    return n ? this.datos.relacionadas(n) : [];
  });
  protected readonly esFavorito = computed(() => this.favoritos.ids().includes(this.id()));

  /** Tamaño de letra del artículo (px), controlado con los botones A- / A+. */
  protected readonly tamanio = signal(18);

  protected cambiarTamanio(delta: number): void {
    this.tamanio.update((t) => Math.min(24, Math.max(14, t + delta)));
  }

  protected alternarFavorito(): void {
    const n = this.noticia();
    if (!n) return;
    const guardado = this.favoritos.alternar(n.id);
    this.toast.mostrar(
      guardado ? 'Artículo guardado' : 'Eliminado de favoritos',
      guardado ? `«${n.titulo}» está en tu biblioteca.` : 'El artículo se retiró de tus guardados.',
      guardado ? 'bookmark_added' : 'bookmark_remove',
    );
  }
}
