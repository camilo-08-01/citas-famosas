import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
  IonIcon, IonFab, IonFabButton
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, settingsOutline } from 'ionicons/icons';
import { Cita, CitasService } from '../services/citas';
import { ConfiguracionService } from '../services/configuracion';
import { CitaItemComponent } from '../cita-item/cita-item.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    CommonModule, RouterLink,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton,
    IonIcon, IonFab, IonFabButton,
    CitaItemComponent
  ],
})
export class HomePage {

  // Cita aleatoria que se muestra (puede no haber ninguna si la tabla está vacía)
  cita?: Cita;

  // Indica si se muestra el botón de borrar; su valor viene de la configuración guardada (Preferences)
  puedeBorrar: boolean = false;

  // Inyección de dependencias: servicio de citas (SQLite), de configuración (Preferences) y detector de cambios
  constructor(
    private citasService: CitasService,
    private configuracionService: ConfiguracionService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ add, settingsOutline });
  }

  // Ciclo de vida de Ionic: al entrar al inicio se inicializa SQLite, se lee la configuración y se elige una cita al azar
  async ionViewWillEnter() {
    await this.citasService.iniciar();
    const config = await this.configuracionService.cargar();
    this.puedeBorrar = config.permitirBorrarEnInicio;
    this.cita = await this.citasService.getAleatoria();
    this.cdr.detectChanges();
  }

  // Se ejecuta cuando el componente hijo emite el evento (borrar) con la cita mostrada
  async eliminar(cita: Cita) {
    if (cita.id !== undefined) {
      await this.citasService.delete(cita.id);
      this.cita = await this.citasService.getAleatoria();
      this.cdr.detectChanges();
    }
  }
}