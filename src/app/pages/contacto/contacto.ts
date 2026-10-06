import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Noticia, NoticiaForm } from '../../models/noticia';
import { AdminService } from '../../services/admin.service';
import { FavoritosService } from '../../services/favoritos.service';
import { NoticiasService } from '../../services/noticias.service';
import { ToastService } from '../../services/toast.service';

type Pestana = 'contacto' | 'gestion';

/**
 * Gestión Editorial & Contacto.
 *  - Pestaña "Contacto": formulario reactivo con validaciones y número de radicado.
 *  - Pestaña "Gestión": CRUD de noticias (crear, ver, editar, eliminar) con formulario reactivo.
 */
@Component({
  selector: 'app-contacto',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './contacto.html',
})
export class Contacto {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly admin = inject(AdminService);
  private readonly favoritos = inject(FavoritosService);
  private readonly toast = inject(ToastService);
  protected readonly datos = inject(NoticiasService);

  protected readonly pestana = signal<Pestana>('contacto');

  // ---------------------------------------------------------------- Contacto
  protected readonly motivos = [
    { valor: 'columna', texto: 'Propuesta de columna ciudadana' },
    { valor: 'denuncia', texto: 'Denuncia o réplica' },
    { valor: 'prensa', texto: 'Solicitud de prensa' },
    { valor: 'soporte', texto: 'Soporte técnico del sitio' },
  ];

  protected readonly contacto = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    motivo: ['', Validators.required],
    mensaje: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
    terminos: [false, Validators.requiredTrue],
  });
  protected readonly longitudMensaje = toSignal(this.contacto.controls.mensaje.valueChanges.pipe(map((v) => v.length)), { initialValue: 0 });
  protected readonly enviando = signal(false);
  protected readonly ticket = signal<string | null>(null);

  /** Un campo muestra error solo después de que el usuario lo tocó. */
  protected mostrarError(control: AbstractControl): boolean {
    return control.invalid && control.touched;
  }

  protected enviarContacto(): void {
    if (this.contacto.invalid) {
      this.contacto.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    // Simulación de envío (no hay backend)
    setTimeout(() => {
      this.ticket.set(`EFD-${Math.floor(100000 + Math.random() * 900000)}`);
      this.enviando.set(false);
      this.contacto.reset();
      this.toast.mostrar('Mensaje enviado', 'Hemos recibido tu solicitud correctamente.', 'task_alt');
    }, 900);
  }

  // ------------------------------------------------------- Gestión de noticias
  protected readonly categoriasForm = ['Tecnología', 'Turismo', 'Educación', 'Comercial'];
  protected readonly filtro = signal('');
  protected readonly filas = computed(() => {
    const q = this.filtro().trim().toLowerCase();
    return this.datos.noticias().filter((n) => q === '' || n.titulo.toLowerCase().includes(q) || n.autor.toLowerCase().includes(q));
  });

  protected readonly modalForm = signal(false);
  protected readonly editando = signal<Noticia | null>(null);
  protected readonly porEliminar = signal<Noticia | null>(null);

  protected readonly noticiaForm = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(8)]],
    categoria: ['Tecnología'],
    autor: ['', Validators.required],
    imagen: ['assets/img/noticias/tecnologia.jpg', [Validators.required, Validators.pattern(/^(https?:\/\/|assets\/).+/)]],
    resumen: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(220)]],
    contenido: ['', [Validators.required, Validators.minLength(30)]],
  });

  protected abrirNueva(): void {
    this.editando.set(null);
    this.noticiaForm.reset();
    this.modalForm.set(true);
  }

  protected abrirEdicion(noticia: Noticia): void {
    this.editando.set(noticia);
    this.noticiaForm.reset({ ...noticia, contenido: noticia.contenido.join('\n') });
    this.modalForm.set(true);
  }

  protected guardarNoticia(): void {
    if (this.noticiaForm.invalid) {
      this.noticiaForm.markAllAsTouched();
      return;
    }
    const v = this.noticiaForm.getRawValue();
    const datos: NoticiaForm = {
      ...v,
      contenido: v.contenido.split('\n').map((p) => p.trim()).filter(Boolean),
    };
    const actual = this.editando();
    if (actual) {
      this.admin.actualizar(actual, datos);
      this.toast.mostrar('Noticia actualizada', `"${datos.titulo}" se guardó correctamente.`, 'task_alt');
    } else {
      this.admin.crear(datos);
      this.toast.mostrar('Noticia creada', `"${datos.titulo}" se publicó en el catálogo.`, 'task_alt');
    }
    this.modalForm.set(false);
  }

  protected confirmarEliminar(): void {
    const n = this.porEliminar();
    if (n) {
      this.admin.eliminar(n.id);
      this.favoritos.quitar(n.id);
      this.toast.mostrar('Noticia eliminada', 'El artículo se eliminó del catálogo.', 'delete_sweep');
    }
    this.porEliminar.set(null);
  }
}
