import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaItemComponent } from './cita-item.component';

describe('CitaItemComponent', () => {
  let component: CitaItemComponent;
  let fixture: ComponentFixture<CitaItemComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CitaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
