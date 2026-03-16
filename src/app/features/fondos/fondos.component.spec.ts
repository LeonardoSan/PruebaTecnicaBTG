import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FondosComponent } from './fondos.component';

describe('Fondos', () => {
  let component: FondosComponent;
  let fixture: ComponentFixture<FondosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FondosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FondosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
