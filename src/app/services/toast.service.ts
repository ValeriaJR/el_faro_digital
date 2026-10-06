import { Injectable, signal } from '@angular/core';

export interface ToastData {
  titulo: string;
  mensaje: string;
  icono: string;
}

/**
 * ToastService
 * Estado de la notificación flotante. El componente <app-toast> lee la señal
 * `toast` y se muestra/oculta solo (binding), sin manipular el DOM a mano.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toast = signal<ToastData | null>(null);
  private temporizador?: ReturnType<typeof setTimeout>;

  mostrar(titulo: string, mensaje: string, icono = 'check_circle'): void {
    this.toast.set({ titulo, mensaje, icono });
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.toast.set(null), 3200);
  }
}
