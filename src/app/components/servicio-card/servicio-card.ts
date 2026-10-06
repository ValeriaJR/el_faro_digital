import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Servicio } from '../../models/servicio';

/** Tarjeta de acceso directo a un servicio (datos de servicios.json). */
@Component({
  selector: 'app-servicio-card',
  imports: [RouterLink],
  templateUrl: './servicio-card.html',
})
export class ServicioCard {
  readonly servicio = input.required<Servicio>();
}
