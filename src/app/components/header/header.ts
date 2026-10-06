import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FavoritosService } from '../../services/favoritos.service';

interface EnlaceMenu {
  texto: string;
  ruta: string;
  exacto: boolean;
}

/**
 * Header: barra superior, logo, buscador global, contador de favoritos y menú.
 * - Interpolación: fecha y contador.
 * - Binding de propiedad/atributo: routerLink, clases activas.
 * - Binding bidireccional: [(ngModel)] en el buscador.
 */
@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, FormsModule, DatePipe],
  templateUrl: './header.html',
})
export class Header {
  protected readonly favoritos = inject(FavoritosService);
  private readonly router = inject(Router);

  protected readonly hoy = new Date();
  protected readonly busqueda = signal('');

  protected readonly menu: EnlaceMenu[] = [
    { texto: 'Inicio', ruta: '/', exacto: true },
    { texto: 'Explorar Noticias', ruta: '/explorar', exacto: false },
    { texto: 'Mis Favoritos', ruta: '/favoritos', exacto: false },
    { texto: 'Gestión & Contacto', ruta: '/contacto', exacto: false },
  ];

  /** Envía el texto del buscador a la página Explorar (?q=...). */
  protected buscar(): void {
    const q = this.busqueda().trim();
    this.router.navigate(['/explorar'], { queryParams: q ? { q } : {} });
  }
}
