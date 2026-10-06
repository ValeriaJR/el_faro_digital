import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FavoritoItem } from '../../components/favorito-item/favorito-item';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';
import { ToastService } from '../../services/toast.service';

/**
 * Mis Favoritos: cruza los IDs guardados (FavoritosService) con las noticias
 * (NoticiasService). Estadísticas, filtros y lista son señales computadas.
 */
@Component({
  selector: 'app-favoritos',
  imports: [RouterLink, FormsModule, FavoritoItem],
  templateUrl: './favoritos.html',
})
export class Favoritos {
  protected readonly datos = inject(NoticiasService);
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);

  protected readonly categoria = signal('all');
  protected readonly busqueda = signal('');
  protected readonly modalVaciar = signal(false);

  protected readonly guardadas = computed(() => this.datos.noticias().filter((n) => this.favoritos.ids().includes(n.id)));
  protected readonly categorias = computed(() => [...new Set(this.guardadas().map((n) => n.categoria))]);
  /** Si la categoría elegida ya no tiene artículos, se vuelve a "todos". */
  protected readonly categoriaActiva = computed(() => (this.categorias().includes(this.categoria()) ? this.categoria() : 'all'));

  protected readonly filtradas = computed(() => {
    const q = this.busqueda().trim().toLowerCase();
    const cat = this.categoriaActiva();
    return this.guardadas().filter(
      (n) => (cat === 'all' || n.categoria === cat) && (q === '' || n.titulo.toLowerCase().includes(q) || n.categoria.toLowerCase().includes(q)),
    );
  });

  protected readonly minutosTotales = computed(() => this.guardadas().reduce((suma, n) => suma + n.tiempoLectura, 0));
  protected readonly categoriaPrincipal = computed(() => {
    const conteo = new Map<string, number>();
    this.guardadas().forEach((n) => conteo.set(n.categoria, (conteo.get(n.categoria) ?? 0) + 1));
    return [...conteo.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
  });

  protected quitar(id: string): void {
    this.favoritos.quitar(id);
    this.toast.mostrar('Artículo eliminado', 'Se eliminó el artículo de tu lista de guardados.', 'bookmark_remove');
  }

  protected vaciar(): void {
    this.favoritos.vaciar();
    this.modalVaciar.set(false);
    this.toast.mostrar('Biblioteca vaciada', 'Se eliminaron todos los artículos guardados.', 'delete_sweep');
  }
}
