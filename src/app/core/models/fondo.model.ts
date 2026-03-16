export interface Fondo {
  id: number;
  nombre: string;
  montoMinimo: number;
  categoria: 'FPV' | 'FIC';
  suscrito?: boolean;
  montoSuscrito?: number;
}

export type TipoTransaccion = 'SUSCRIPCION' | 'CANCELACION';

export type MetodoNotificacion = 'email' | 'sms';

export interface Transaccion {
  id: string;
  fondoId: number;
  fondoNombre: string;
  tipo: TipoTransaccion;
  monto: number;
  fecha: Date;
  metodoNotificacion?: MetodoNotificacion;
}

export interface AppState {
  saldo: number;
  fondos: Fondo[];
  transacciones: Transaccion[];
}
