import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

// Modelo de una cita: la frase y quién la dijo o escribió
export interface Cita {
  id?: number;
  frase: string;
  autor: string;
}

@Injectable({
  providedIn: 'root'
})
export class CitasService {

  private readonly NOMBRE_BD = 'citas_db';

  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db?: SQLiteDBConnection;
  private inicio?: Promise<void>;

  // Citas iniciales (se insertan la primera vez que se crea la tabla)
  private readonly citasIniciales: Cita[] = [
    { frase: 'El éxito consiste en obtener lo que se desea. La felicidad en disfrutar lo que se obtiene.', autor: 'Ralph Waldo Emerson' },
    { frase: 'Las personas no son recordadas por el número de veces que fracasan, sino por el número de veces que tienen éxito.', autor: 'Thomas Edison' },
    { frase: 'Ningún viento es bueno para el barco que no sabe adónde va.', autor: 'Séneca' }
  ];

  // Respaldo solo para el navegador (ionic serve), donde SQLite nativo no existe
  private memoria: Cita[] = this.citasIniciales.map((c, i) => ({ ...c, id: i + 1 }));
  private siguienteId = 4;

  private get esNativo(): boolean {
    return Capacitor.isNativePlatform();
  }

  // Inicializa la base de datos una sola vez, aunque varias páginas lo pidan a la vez
  iniciar(): Promise<void> {
    if (!this.inicio) {
      this.inicio = this.crearBaseDeDatos();
    }
    return this.inicio;
  }

  private async crearBaseDeDatos(): Promise<void> {
    if (!this.esNativo) {
      return;
    }

    // Si la conexión ya existe (por ejemplo tras recargar la app), se reutiliza
    const consistente = (await this.sqlite.checkConnectionsConsistency()).result;
    const existe = (await this.sqlite.isConnection(this.NOMBRE_BD, false)).result;

    if (consistente && existe) {
      this.db = await this.sqlite.retrieveConnection(this.NOMBRE_BD, false);
    } else {
      this.db = await this.sqlite.createConnection(this.NOMBRE_BD, false, 'no-encryption', 1, false);
    }

    await this.db.open();

    // Crea la tabla si no existe
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        frase TEXT NOT NULL,
        autor TEXT NOT NULL
      );
    `);

    // Si la tabla está vacía, se cargan las citas iniciales
    const resultado = await this.db.query('SELECT COUNT(*) AS total FROM citas');
    if (resultado.values && resultado.values[0].total === 0) {
      for (const c of this.citasIniciales) {
        await this.db.run('INSERT INTO citas (frase, autor) VALUES (?, ?)', [c.frase, c.autor]);
      }
    }
  }

  // Devuelve todas las citas
  async getAll(): Promise<Cita[]> {
    await this.iniciar();
    if (!this.db) {
      return [...this.memoria];
    }
    const resultado = await this.db.query('SELECT id, frase, autor FROM citas');
    return (resultado.values ?? []) as Cita[];
  }

  // Devuelve una cita al azar (o undefined si no quedan citas)
  async getAleatoria(): Promise<Cita | undefined> {
    await this.iniciar();
    if (!this.db) {
      if (this.memoria.length === 0) {
        return undefined;
      }
      return this.memoria[Math.floor(Math.random() * this.memoria.length)];
    }
    const resultado = await this.db.query('SELECT id, frase, autor FROM citas ORDER BY RANDOM() LIMIT 1');
    return resultado.values && resultado.values.length > 0 ? (resultado.values[0] as Cita) : undefined;
  }

  // Agrega una cita nueva
  async add(cita: Cita): Promise<void> {
    await this.iniciar();
    if (!this.db) {
      this.memoria.push({ ...cita, id: this.siguienteId++ });
      return;
    }
    await this.db.run('INSERT INTO citas (frase, autor) VALUES (?, ?)', [cita.frase, cita.autor]);
  }

  // Elimina una cita por su id
  async delete(id: number): Promise<void> {
    await this.iniciar();
    if (!this.db) {
      this.memoria = this.memoria.filter(c => c.id !== id);
      return;
    }
    await this.db.run('DELETE FROM citas WHERE id = ?', [id]);
  }
}