import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CopPipe } from '../../shared/pipes/cop.pipe';
import { ModalSuscripcionComponent } from '../../shared/components/modal-suscripcion/modal-suscripcion.component';
import { ToastComponent, ToastType } from '../../shared/components/toast/toast.component';
import { Fondo, MetodoNotificacion } from '../../core/models/fondo.model';
import { FondosService } from '../../core/services/fondos.service';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Component({
  selector: 'app-fondos',
  standalone: true,
  imports: [CommonModule, CopPipe, ModalSuscripcionComponent, ToastComponent],
  templateUrl: './fondos.component.html',
  styleUrl: './fondos.component.scss',
})
export class FondosComponent implements OnInit, OnDestroy {
  fondos: Fondo[] = [];
  saldo = 0;
  loading = false;
  fondoSeleccionado: Fondo | null = null;
  filtroActivo: 'todos' | 'FPV' | 'FIC' = 'todos';
  toasts: Toast[] = [];
  private toastCounter = 0;
  private destroy$ = new Subject<void>();

  constructor(private fondosService: FondosService) {}

  ngOnInit() {
    this.fondosService.saldo$.pipe(takeUntil(this.destroy$)).subscribe((s) => (this.saldo = s));

    this.fondosService.fondos$.pipe(takeUntil(this.destroy$)).subscribe((f) => (this.fondos = f));

    this.fondosService.loading$.pipe(takeUntil(this.destroy$)).subscribe((l) => (this.loading = l));

    this.fondosService.getFondos().subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get fondosFiltrados(): Fondo[] {
    if (this.filtroActivo === 'todos') return this.fondos;
    return this.fondos.filter((f) => f.categoria === this.filtroActivo);
  }

  setFiltro(filtro: 'todos' | 'FPV' | 'FIC') {
    this.filtroActivo = filtro;
  }

  abrirModal(fondo: Fondo) {
    if (this.saldo < fondo.montoMinimo) {
      this.showToast(
        `Saldo insuficiente. Necesita ${fondo.montoMinimo.toLocaleString('es-CO')} COP mínimo.`,
        'error',
      );
      return;
    }
    this.fondoSeleccionado = fondo;
  }

  cerrarModal() {
    this.fondoSeleccionado = null;
  }

  confirmarSuscripcion(metodo: MetodoNotificacion) {
    if (!this.fondoSeleccionado) return;
    const fondo = this.fondoSeleccionado;

    this.fondosService.suscribirse(fondo.id, metodo).subscribe({
      next: (txn) => {
        this.cerrarModal();
        this.showToast(
          `✓ Suscripción exitosa a ${fondo.nombre}. Notificación enviada por ${metodo === 'email' ? 'Email' : 'SMS'}.`,
          'success',
        );
      },
      error: (err) => {
        this.cerrarModal();
        this.showToast(err.message, 'error', 6000);
      },
    });
  }

  cancelar(fondo: Fondo) {
    this.fondosService.cancelarSuscripcion(fondo.id).subscribe({
      next: (txn) => {
        this.showToast(
          `Suscripción cancelada. Se reintegró ${fondo.montoMinimo.toLocaleString('es-CO')} COP a su cuenta.`,
          'info',
        );
      },
      error: (err) => {
        this.showToast(err.message, 'error');
      },
    });
  }

  showToast(message: string, type: ToastType, duration = 4000) {
    const id = ++this.toastCounter;
    this.toasts.push({ id, message, type });
  }

  removeToast(id: number) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
