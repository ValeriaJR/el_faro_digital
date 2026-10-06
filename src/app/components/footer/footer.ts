import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ColumnaFooter {
  titulo: string;
  enlaces: { texto: string; ruta: string; categoria?: string }[];
}

/** Pie de página: las columnas se declaran como datos y se pintan con @for. */
@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class Footer {
  protected readonly anio = new Date().getFullYear();

  protected readonly columnas: ColumnaFooter[] = [
    { titulo: 'Educación', enlaces: [
      { texto: 'Universidades & I+D', ruta: '/explorar', categoria: 'Educación' },
      { texto: 'Becas & Posgrados', ruta: '/explorar', categoria: 'Educación' } ] },
    { titulo: 'Tecnología', enlaces: [
      { texto: 'Inteligencia Artificial', ruta: '/explorar', categoria: 'Tecnología' },
      { texto: 'Ciberseguridad', ruta: '/explorar', categoria: 'Tecnología' } ] },
    { titulo: 'Comercio & Turismo', enlaces: [
      { texto: 'Mercados y Finanzas', ruta: '/explorar', categoria: 'Comercial' },
      { texto: 'Destinos Sostenibles', ruta: '/explorar', categoria: 'Turismo' } ] },
    { titulo: 'Opinión & Redacción', enlaces: [
      { texto: 'Columnistas Invitados', ruta: '/contacto' },
      { texto: 'Tribuna Ciudadana', ruta: '/contacto' } ] },
  ];
}
