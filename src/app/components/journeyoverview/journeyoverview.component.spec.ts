import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyoverviewComponent } from './journeyoverview.component';

describe('JourneyoverviewComponent', () => {
  let component: JourneyoverviewComponent;
  let fixture: ComponentFixture<JourneyoverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyoverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyoverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
