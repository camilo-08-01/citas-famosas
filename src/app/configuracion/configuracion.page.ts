import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonList, IonItem, IonToggle
} from '@ionic/angular';
import { Configuracion, ConfiguracionService } from '../services/configuracion';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonList, IonItem, IonToggle
  ]
})
export class ConfiguracionPage {

  // Configuración que se muestra y modifica en pantalla
  config: Configuracion = { permitirBorrarEnInicio: false };

  constructor(
    private configuracionService: ConfiguracionService,
    private cdr: ChangeDetectorRef
  ) {}

  // Ciclo de vida de Ionic: cada vez que se entra, se carga lo guardado
  async ionViewWillEnter() {
    this.config = await this.configuracionService.cargar();
    this.cdr.detectChanges();
  }

  // Se ejecuta cada vez que el usuario cambia el interruptor
  async onChange() {
    await this.configuracionService.guardar(this.config);
  }
}