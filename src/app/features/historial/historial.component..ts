import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CopPipe } from '../../shared/pipes/cop.pipe';
import { Transaccion } from '../../core/models/fondo.model';
import { FondosService } from '../../core/services/fondos.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule, CopPipe],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.scss',
})
export class HistorialComponent implements OnInit, OnDestroy {
  transacciones: Transaccion[] = [];
  private destroy$ = new Subject<void>();

  constructor(private fondosService: FondosService) {}

  ngOnInit() {
    this.fondosService.transacciones$
      .pipe(takeUntil(this.destroy$))
      .subscribe((t) => (this.transacciones = t));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get totalSuscripciones(): number {
    return this.transacciones.filter((t) => t.tipo === 'SUSCRIPCION').length;
  }

  get totalCancelaciones(): number {
    return this.transacciones.filter((t) => t.tipo === 'CANCELACION').length;
  }

  get totalInvertido(): number {
    return this.transacciones
      .filter((t) => t.tipo === 'SUSCRIPCION')
      .reduce((acc, t) => acc + t.monto, 0);
  }
}
