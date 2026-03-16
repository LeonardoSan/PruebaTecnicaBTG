import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { CopPipe } from '../../pipes/cop.pipe';
import { Fondo, MetodoNotificacion } from '../../../core/models/fondo.model';

@Component({
  selector: 'app-modal-suscripcion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CopPipe],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(40px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
  ],
  templateUrl: './modal-suscripcion.component.html',
  styleUrl: './modal-suscripcion.component.scss',
})
export class ModalSuscripcionComponent {
  @Input() fondo!: Fondo;
  @Input() saldo = 0;
  @Input() loading = false;
  @Output() confirmar = new EventEmitter<MetodoNotificacion>();
  @Output() cancelar = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      metodo: ['email', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid && this.saldo >= this.fondo.montoMinimo) {
      this.confirmar.emit(this.form.get('metodo')?.value as MetodoNotificacion);
    } else {
      this.form.markAllAsTouched();
    }
  }

  onCancel() {
    this.cancelar.emit();
  }
}
