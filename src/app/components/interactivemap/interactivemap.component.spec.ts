import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractivemapComponent } from './interactivemap.component';

describe('InteractivemapComponent', () => {
  let component: InteractivemapComponent;
  let fixture: ComponentFixture<InteractivemapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractivemapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractivemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
