import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Noticia } from '../../models/noticia';

/**
 * Fila de la lista "Mis Favoritos".
 * - input(): recibe la noticia. output(): avisa al padre cuando se pulsa "eliminar".
 */
@Component({
  selector: 'app-favorito-item',
  imports: [RouterLink],
  templateUrl: './favorito-item.html',
})
export class FavoritoItem {
  readonly noticia = input.required<Noticia>();
  readonly eliminar = output<string>();
}
