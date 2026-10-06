import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NewsCard } from '../../components/news-card/news-card';
import { ServicioCard } from '../../components/servicio-card/servicio-card';
import { NoticiasService } from '../../services/noticias.service';
import { ToastService } from '../../services/toast.service';

/**
 * Página de Inicio: hero destacado, noticias de portada, servicios (JSON) y newsletter.
 * Todo el contenido sale de NoticiasService (señales) y se pinta con @if / @for.
 */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, ReactiveFormsModule, NewsCard, ServicioCard, DatePipe],
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly datos = inject(NoticiasService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly destacada = computed(() => this.datos.noticias().find((n) => n.destacada) ?? this.datos.noticias()[0]);
  protected readonly secundaria = computed(() => this.datos.noticias().find((n) => n.id !== this.destacada()?.id));
  protected readonly portada = computed(() => this.datos.noticias().slice(0, 4));

  // ---- Newsletter (formulario reactivo con validaciones) ----
  protected readonly newsletter = this.fb.group({
    nombre: [''],
    correo: ['', [Validators.required, Validators.email]],
  });
  protected readonly suscrito = signal(false);

  protected suscribirse(): void {
    if (this.newsletter.invalid) {
      this.newsletter.markAllAsTouched();
      return;
    }
    const nombre = this.newsletter.controls.nombre.value.trim() || 'lector';
    this.toast.mostrar('¡Suscripción exitosa!', `Te añadimos a la lista, ${nombre}.`, 'mark_email_read');
    this.newsletter.reset();
    this.suscrito.set(true);
    setTimeout(() => this.suscrito.set(false), 4000);
  }
}
