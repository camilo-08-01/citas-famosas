import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonList, IonItem, IonInput, IonButton, IonIcon, IonText
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Cita, CitasService } from '../services/citas';
import { CitaItemComponent } from '../cita-item/cita-item.component';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.page.html',
  styleUrls: ['./citas.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonList, IonItem, IonInput, IonButton, IonIcon, IonText,
    CitaItemComponent
  ]
})
export class CitasPage {

  // Lista de citas que se muestra en pantalla (viene de SQLite)
  citas: Cita[] = [];

  // Campos del formulario, enlazados con [(ngModel)]
  frase: string = '';
  autor: string = '';

  // Inyección de dependencias: el servicio y el detector de cambios llegan por el constructor
  constructor(private citasService: CitasService, private cdr: ChangeDetectorRef) {
    addIcons({ add });
  }

  // Ciclo de vida de Ionic: al entrar a la página se inicializa SQLite y luego se recarga la lista
  async ionViewWillEnter() {
    await this.citasService.iniciar();
    await this.cargar();
  }

  // Lee todas las citas desde el servicio y redibuja la pantalla
  async cargar() {
    this.citas = await this.citasService.getAll();
    this.cdr.detectChanges();
  }

  // Agrega una cita nueva, limpia el formulario y recarga la lista
  async agregar(formulario: NgForm) {
    // Segunda barrera: si el formulario es inválido, no se hace nada
    if (formulario.invalid) {
      return;
    }
    await this.citasService.add({ frase: this.frase.trim(), autor: this.autor.trim() });
    formulario.resetForm();
    this.frase = '';
    this.autor = '';
    await this.cargar();
  }

  // Se ejecuta cuando el componente hijo emite el evento (borrar)
  async eliminar(cita: Cita) {
    if (cita.id !== undefined) {
      await this.citasService.delete(cita.id);
      await this.cargar();
    }
  }
}