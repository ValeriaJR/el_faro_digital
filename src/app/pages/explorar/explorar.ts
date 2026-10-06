import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NewsCard } from '../../components/news-card/news-card';
import { Noticia } from '../../models/noticia';
import { NoticiasService } from '../../services/noticias.service';

type Orden = 'reciente' | 'antiguo' | 'lectura-corta' | 'populares';

/**
 * Explorar: búsqueda, filtro por categoría y orden sobre las noticias.
 * `resultados` es una señal computada: se recalcula sola cuando cambia
 * la búsqueda, la categoría, el orden o la lista de noticias.
 */
@Component({
  selector: 'app-explorar',
  imports: [FormsModule, NewsCard],
  templateUrl: './explorar.html',
})
export class Explorar {
  protected readonly datos = inject(NoticiasService);
  private readonly params = toSignal(inject(ActivatedRoute).queryParamMap);

  protected readonly busqueda = signal('');
  protected readonly categoria = signal('all');
  protected readonly orden = signal<Orden>('reciente');

  protected readonly resultados = computed<Noticia[]>(() => {
    const q = this.busqueda().trim().toLowerCase();
    const cat = this.categoria();
    const filtradas = this.datos.noticias().filter(
      (n) =>
        (cat === 'all' || n.categoria === cat) &&
        (q === '' || [n.titulo, n.resumen, n.categoria, n.autor].some((t) => t.toLowerCase().includes(q))),
    );
    return [...filtradas].sort((a, b) => {
      switch (this.orden()) {
        case 'antiguo': return a.fecha.localeCompare(b.fecha);
        case 'lectura-corta': return a.tiempoLectura - b.tiempoLectura;
        case 'populares': return b.vistas - a.vistas;
        default: return b.fecha.localeCompare(a.fecha);
      }
    });
  });

  constructor() {
    // Lee ?categoria= y ?q= de la URL (enlaces del footer, servicios y buscador del header).
    effect(() => {
      const p = this.params();
      this.categoria.set(p?.get('categoria') ?? 'all');
      this.busqueda.set(p?.get('q') ?? '');
    });
  }

  protected reiniciar(): void {
    this.categoria.set('all');
    this.busqueda.set('');
    this.orden.set('reciente');
  }
}
