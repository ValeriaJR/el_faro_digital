import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

/** Notificación flotante: se muestra cuando ToastService.toast() tiene valor. */
@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
})
export class Toast {
  protected readonly servicio = inject(ToastService);
}
