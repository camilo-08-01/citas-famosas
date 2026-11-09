import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

// Estructura de las configuraciones que se van a persistir
export interface Configuracion {
  permitirBorrarEnInicio: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {

  // Clave con la que se guarda el objeto en Preferences
  private readonly CLAVE = 'configuracion';

  // Valores por defecto si el usuario aún no ha guardado nada
  private readonly porDefecto: Configuracion = {
    permitirBorrarEnInicio: false
  };

  // Recupera la configuración guardada (o la por defecto)
  async cargar(): Promise<Configuracion> {
    const { value } = await Preferences.get({ key: this.CLAVE });
    return value ? JSON.parse(value) : { ...this.porDefecto };
  }

  // Guarda la configuración como texto JSON
  async guardar(config: Configuracion): Promise<void> {
    await Preferences.set({
      key: this.CLAVE,
      value: JSON.stringify(config)
    });
  }
}