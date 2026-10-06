import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Contacto } from './pages/contacto/contacto';
import { Favoritos } from './pages/favoritos/favoritos';
import { Inicio } from './pages/inicio/inicio';
import { Explorar } from './pages/explorar/explorar';
import { NoticiaDetalle } from './pages/noticia/noticia';
import { Header } from './components/header/header';
import { AdminService } from './services/admin.service';
import { FavoritosService } from './services/favoritos.service';
import { NoticiasService } from './services/noticias.service';
import { NOTICIAS_PRUEBA, SERVICIOS_PRUEBA } from './testing/datos-prueba';

/** Configura TestBed y responde a los dos JSON con datos de prueba. */
function preparar() {
  localStorage.clear();
  TestBed.configureTestingModule({
    providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
  });
  const http = TestBed.inject(HttpTestingController);
  const noticias = TestBed.inject(NoticiasService);
  http.expectOne('assets/data/noticias.json').flush(NOTICIAS_PRUEBA);
  http.expectOne('assets/data/servicios.json').flush(SERVICIOS_PRUEBA);
  return { http, noticias };
}

describe('FavoritosService', () => {
  it('alterna, cuenta, persiste y vacía', () => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    const f = TestBed.inject(FavoritosService);
    expect(f.total()).toBe(0);
    expect(f.alternar('a')).toBe(true);
    expect(f.alternar('b')).toBe(true);
    expect(f.total()).toBe(2);
    expect(JSON.parse(localStorage.getItem('elfaro_favoritos')!)).toEqual(['a', 'b']);
    expect(f.alternar('a')).toBe(false);
    f.quitar('b');
    expect(f.total()).toBe(0);
    f.alternar('c');
    f.vaciar();
    expect(f.ids()).toEqual([]);
  });
});

describe('NoticiasService + AdminService (CRUD)', () => {
  it('combina el JSON con crear, editar y eliminar', () => {
    const { noticias } = preparar();
    const admin = TestBed.inject(AdminService);
    expect(noticias.noticias().length).toBe(3);
    expect(noticias.categorias()).toEqual(['Tecnología', 'Turismo']);

    const nueva = admin.crear({ titulo: 'Titular nuevo de prueba', categoria: 'Educación', autor: 'Val', imagen: 'assets/x.jpg', resumen: 'Un resumen de más de veinte caracteres', contenido: ['uno', 'dos'] });
    expect(noticias.noticias().length).toBe(4);
    expect(noticias.porId(nueva.id)?.autor).toBe('Val');

    admin.actualizar(noticias.porId('a')!, { titulo: 'Titular editado', categoria: 'Tecnología', autor: 'Ana', imagen: 'x', resumen: 'r', contenido: ['p'] });
    expect(noticias.porId('a')?.titulo).toBe('Titular editado');

    admin.eliminar('b');
    admin.eliminar(nueva.id);
    expect(noticias.noticias().map((n) => n.id)).toEqual(['a', 'c']);
    expect(noticias.relacionadas(noticias.porId('a')!).map((n) => n.id)).toEqual(['c']);
  });
});

describe('Inicio', () => {
  it('pinta hero, 4 tarjetas máx. y servicios desde JSON', async () => {
    preparar();
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Noticia A de tecnología');
    expect(el.querySelectorAll('app-news-card').length).toBe(3);
    expect(el.querySelectorAll('app-servicio-card').length).toBe(1);
  });

  it('valida el correo del newsletter', async () => {
    preparar();
    const fixture = TestBed.createComponent(Inicio);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    expect(el.textContent).toContain('Ingresa un correo electrónico válido.');
  });
});

describe('Explorar', () => {
  it('filtra por categoría y búsqueda, y ordena', async () => {
    preparar();
    const fixture = TestBed.createComponent(Explorar);
    await fixture.whenStable();
    const c = fixture.componentInstance as any;
    expect(c.resultados().length).toBe(3);
    c.categoria.set('Tecnología');
    expect(c.resultados().map((n: any) => n.id)).toEqual(['a', 'c']);
    c.busqueda.set('noticia c');
    expect(c.resultados().map((n: any) => n.id)).toEqual(['c']);
    c.reiniciar();
    c.orden.set('lectura-corta');
    expect(c.resultados().map((n: any) => n.id)).toEqual(['c', 'a', 'b']);
    c.orden.set('populares');
    expect(c.resultados()[0].id).toBe('a');
  });
});

describe('NoticiaDetalle', () => {
  it('muestra la noticia por id, relacionadas y estado "no encontrada"', async () => {
    preparar();
    const fixture = TestBed.createComponent(NoticiaDetalle);
    fixture.componentRef.setInput('id', 'a');
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('h1')?.textContent).toContain('Noticia A de tecnología');
    expect(el.querySelectorAll('app-news-card').length).toBe(1); // C es de la misma categoría
    fixture.componentRef.setInput('id', 'no-existe');
    await fixture.whenStable();
    expect(el.textContent).toContain('No encontramos esta noticia');
  });
});

describe('Favoritos (página) + Header (badge)', () => {
  it('lista guardadas, estadísticas y vaciar', async () => {
    preparar();
    const f = TestBed.inject(FavoritosService);
    f.alternar('a');
    f.alternar('b');
    const header = TestBed.createComponent(Header);
    const fixture = TestBed.createComponent(Favoritos);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelectorAll('app-favorito-item').length).toBe(2);
    expect(el.textContent).toContain('10 min'); // 4 + 6
    expect(header.nativeElement.textContent).toContain('2');
    (fixture.componentInstance as any).vaciar();
    await fixture.whenStable();
    expect(el.textContent).toContain('Aún no tienes artículos guardados');
  });
});

describe('Contacto', () => {
  it('valida el formulario de contacto y genera radicado', async () => {
    preparar();
    const fixture = TestBed.createComponent(Contacto);
    await fixture.whenStable();
    vi.useFakeTimers(); // después de estabilizar, para simular el envío de 900 ms
    const c = fixture.componentInstance as any;
    c.enviarContacto();
    expect(c.contacto.invalid).toBe(true);
    expect(c.ticket()).toBeNull();
    c.contacto.setValue({ nombre: 'Valeria J', correo: 'correo-malo', motivo: 'prensa', mensaje: 'Mensaje con más de veinte caracteres', terminos: true });
    expect(c.contacto.controls.correo.hasError('email')).toBe(true);
    c.contacto.controls.correo.setValue('val@correo.com');
    c.enviarContacto();
    expect(c.enviando()).toBe(true);
    vi.advanceTimersByTime(1000);
    expect(c.ticket()).toMatch(/^EFD-\d{6}$/);
    vi.useRealTimers();
  });

  it('CRUD: valida, crea, edita y elimina desde el panel', async () => {
    const { noticias } = preparar();
    const fixture = TestBed.createComponent(Contacto);
    await fixture.whenStable();
    const c = fixture.componentInstance as any;
    c.pestana.set('gestion');
    c.abrirNueva();
    c.guardarNoticia();
    expect(c.modalForm()).toBe(true); // inválido: no se cierra
    c.noticiaForm.patchValue({ titulo: 'Un titular válido', autor: 'Val', resumen: 'Resumen con más de veinte caracteres', contenido: 'Primer párrafo del contenido de la noticia\nSegundo' });
    c.guardarNoticia();
    expect(c.modalForm()).toBe(false);
    expect(noticias.noticias().length).toBe(4);
    const creada = noticias.noticias()[3];
    expect(creada.contenido.length).toBe(2);
    c.abrirEdicion(creada);
    c.noticiaForm.patchValue({ titulo: 'Titular editado válido' });
    c.guardarNoticia();
    expect(noticias.porId(creada.id)?.titulo).toBe('Titular editado válido');
    c.porEliminar.set(creada);
    c.confirmarEliminar();
    expect(noticias.noticias().length).toBe(3);
  });
});
