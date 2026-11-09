import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonItem, IonLabel } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Cita } from '../services/citas';

@Component({
  selector: 'app-cita-item',
  templateUrl: './cita-item.component.html',
  styleUrls: ['./cita-item.component.scss'],
  standalone: true,
  imports: [CommonModule, IonItem, IonLabel, IonButton, IonIcon]
})
export class CitaItemComponent {

  // @Input: el padre le pasa la cita que debe mostrar
  @Input() cita!: Cita;

  // @Input: indica si se debe mostrar el botón de borrar
  @Input() mostrarBorrar: boolean = true;

  // @Output: el hijo avisa al padre que se pidió borrar esta cita
  @Output() borrar = new EventEmitter<Cita>();

  constructor() {
    addIcons({ trashOutline });
  }

  // Se ejecuta al presionar el tacho: emite el evento con la cita
  onBorrar() {
    this.borrar.emit(this.cita);
  }
}