import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupoverviewComponent } from './pickupoverview.component';

describe('PickupoverviewComponent', () => {
  let component: PickupoverviewComponent;
  let fixture: ComponentFixture<PickupoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
