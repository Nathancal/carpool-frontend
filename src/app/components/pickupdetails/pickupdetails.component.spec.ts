import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupdetailsComponent } from './pickupdetails.component';

describe('PickupdetailsComponent', () => {
  let component: PickupdetailsComponent;
  let fixture: ComponentFixture<PickupdetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupdetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
