import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia';
import { FavoritosService } from '../../services/favoritos.service';
import { ToastService } from '../../services/toast.service';

/**
 * Tarjeta de noticia reutilizable (portada, explorar y relacionadas).
 * - @Input (input signal): recibe la noticia desde el componente padre.
 * - Event binding: (click) alterna el favorito.
 */
@Component({
  selector: 'app-news-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './news-card.html',
})
export class NewsCard {
  readonly noticia = input.required<Noticia>();

  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  protected readonly esFavorito = computed(() => this.favoritos.ids().includes(this.noticia().id));

  /** Relleno del ícono de corazón (variable font de Material Symbols). */
  protected readonly relleno = computed(() => `'FILL' ${this.esFavorito() ? 1 : 0}`);

  protected alternarFavorito(evento: Event): void {
    evento.preventDefault();
    evento.stopPropagation();
    const guardado = this.favoritos.alternar(this.noticia().id);
    this.toast.mostrar(
      guardado ? 'Añadido a Favoritos' : 'Removido de Guardados',
      guardado ? `"${this.noticia().titulo}" quedó en tu biblioteca.` : 'El artículo se retiró de tus marcadores.',
      guardado ? 'bookmark_added' : 'bookmark_remove',
    );
  }
}
