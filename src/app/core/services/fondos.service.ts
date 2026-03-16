import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Fondo, Transaccion, MetodoNotificacion, AppState } from '../models/fondo.model';

const FONDOS_INICIALES: Fondo[] = [
  {
    id: 1,
    nombre: 'FPV_BTG_PACTUAL_RECAUDADORA',
    montoMinimo: 75000,
    categoria: 'FPV',
    suscrito: false,
  },
  {
    id: 2,
    nombre: 'FPV_BTG_PACTUAL_ECOPETROL',
    montoMinimo: 125000,
    categoria: 'FPV',
    suscrito: false,
  },
  { id: 3, nombre: 'DEUDAPRIVADA', montoMinimo: 50000, categoria: 'FIC', suscrito: false },
  { id: 4, nombre: 'FDO-ACCIONES', montoMinimo: 250000, categoria: 'FIC', suscrito: false },
  {
    id: 5,
    nombre: 'FPV_BTG_PACTUAL_DINAMICA',
    montoMinimo: 100000,
    categoria: 'FPV',
    suscrito: false,
  },
];

const SALDO_INICIAL = 500000;

@Injectable({
  providedIn: 'root',
})
export class FondosService {
  private saldoSubject = new BehaviorSubject<number>(SALDO_INICIAL);
  private fondosSubject = new BehaviorSubject<Fondo[]>([...FONDOS_INICIALES]);
  private transaccionesSubject = new BehaviorSubject<Transaccion[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  saldo$ = this.saldoSubject.asObservable();
  fondos$ = this.fondosSubject.asObservable();
  transacciones$ = this.transaccionesSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  getFondos(): Observable<Fondo[]> {
    this.loadingSubject.next(true);
    return of(this.fondosSubject.getValue()).pipe(
      delay(600),
      map((fondos) => {
        this.loadingSubject.next(false);
        return fondos;
      }),
    );
  }

  suscribirse(fondoId: number, metodoNotificacion: MetodoNotificacion): Observable<Transaccion> {
    const fondos = this.fondosSubject.getValue();
    const fondo = fondos.find((f) => f.id === fondoId);
    const saldoActual = this.saldoSubject.getValue();

    if (!fondo) {
      return throwError(() => new Error('Fondo no encontrado'));
    }
    if (fondo.suscrito) {
      return throwError(() => new Error(`Ya está suscrito al fondo ${fondo.nombre}`));
    }
    if (saldoActual < fondo.montoMinimo) {
      return throwError(
        () =>
          new Error(
            `No tiene saldo suficiente para vincularse al fondo ${fondo.nombre}. ` +
              `Monto mínimo: $${fondo.montoMinimo.toLocaleString('es-CO')}. ` +
              `Saldo disponible: $${saldoActual.toLocaleString('es-CO')}`,
          ),
      );
    }

    this.loadingSubject.next(true);

    return of(null).pipe(
      delay(800),
      map(() => {
        const nuevoSaldo = saldoActual - fondo.montoMinimo;
        this.saldoSubject.next(nuevoSaldo);

        const fondosActualizados = fondos.map((f) =>
          f.id === fondoId ? { ...f, suscrito: true, montoSuscrito: fondo.montoMinimo } : f,
        );
        this.fondosSubject.next(fondosActualizados);

        const transaccion: Transaccion = {
          id: this.generarId(),
          fondoId: fondo.id,
          fondoNombre: fondo.nombre,
          tipo: 'SUSCRIPCION',
          monto: fondo.montoMinimo,
          fecha: new Date(),
          metodoNotificacion,
        };

        const transaccionesActuales = this.transaccionesSubject.getValue();
        this.transaccionesSubject.next([transaccion, ...transaccionesActuales]);

        this.loadingSubject.next(false);
        return transaccion;
      }),
    );
  }

  cancelarSuscripcion(fondoId: number): Observable<Transaccion> {
    const fondos = this.fondosSubject.getValue();
    const fondo = fondos.find((f) => f.id === fondoId);

    if (!fondo) {
      return throwError(() => new Error('Fondo no encontrado'));
    }
    if (!fondo.suscrito) {
      return throwError(() => new Error(`No está suscrito al fondo ${fondo.nombre}`));
    }

    this.loadingSubject.next(true);

    return of(null).pipe(
      delay(800),
      map(() => {
        const montoDevuelto = fondo.montoSuscrito ?? fondo.montoMinimo;

        const saldoActual = this.saldoSubject.getValue();
        this.saldoSubject.next(saldoActual + montoDevuelto);

        const fondosActualizados = fondos.map((f) =>
          f.id === fondoId ? { ...f, suscrito: false, montoSuscrito: undefined } : f,
        );
        this.fondosSubject.next(fondosActualizados);

        const transaccion: Transaccion = {
          id: this.generarId(),
          fondoId: fondo.id,
          fondoNombre: fondo.nombre,
          tipo: 'CANCELACION',
          monto: montoDevuelto,
          fecha: new Date(),
        };

        const transaccionesActuales = this.transaccionesSubject.getValue();
        this.transaccionesSubject.next([transaccion, ...transaccionesActuales]);

        this.loadingSubject.next(false);
        return transaccion;
      }),
    );
  }

  getTransacciones(): Observable<Transaccion[]> {
    return this.transacciones$;
  }

  private generarId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  }
}
