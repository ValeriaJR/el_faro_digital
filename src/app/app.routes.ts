import { Routes } from '@angular/router';

/** Las 5 páginas del sitio; cada una se carga bajo demanda (lazy loading). */
export const routes: Routes = [
  { path: '', title: 'El Faro Digital · Inicio', loadComponent: () => import('./pages/inicio/inicio').then((m) => m.Inicio) },
  { path: 'explorar', title: 'Explorar Noticias · El Faro Digital', loadComponent: () => import('./pages/explorar/explorar').then((m) => m.Explorar) },
  { path: 'noticia/:id', title: 'Detalle de Noticia · El Faro Digital', loadComponent: () => import('./pages/noticia/noticia').then((m) => m.NoticiaDetalle) },
  { path: 'favoritos', title: 'Mis Favoritos · El Faro Digital', loadComponent: () => import('./pages/favoritos/favoritos').then((m) => m.Favoritos) },
  { path: 'contacto', title: 'Gestión y Contacto · El Faro Digital', loadComponent: () => import('./pages/contacto/contacto').then((m) => m.Contacto) },
  { path: '**', redirectTo: '' },
];
