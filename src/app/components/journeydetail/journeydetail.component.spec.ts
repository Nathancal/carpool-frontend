import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneydetailComponent } from './journeydetail.component';

describe('JourneydetailComponent', () => {
  let component: JourneydetailComponent;
  let fixture: ComponentFixture<JourneydetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneydetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
