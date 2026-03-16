import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSuscripcionComponent } from './modal-suscripcion.component';

describe('ModalSuscripcion', () => {
  let component: ModalSuscripcionComponent;
  let fixture: ComponentFixture<ModalSuscripcionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSuscripcionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalSuscripcionComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
