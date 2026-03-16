import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

export type ToastType = 'success' | 'error' | 'info';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 })),
      ]),
    ]),
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
})
export class ToastComponent implements OnInit, OnDestroy {
  @Input() message = '';
  @Input() type: ToastType = 'info';
  @Input() duration = 4000;
  @Output() closed = new EventEmitter<void>();

  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit() {
    if (this.duration > 0) {
      this.timer = setTimeout(() => this.onClose(), this.duration);
    }
  }

  ngOnDestroy() {
    if (this.timer) clearTimeout(this.timer);
  }

  onClose() {
    this.closed.emit();
  }
}
