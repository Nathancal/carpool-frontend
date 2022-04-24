import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewuserComponent } from './reviewuser.component';

describe('ReviewuserComponent', () => {
  let component: ReviewuserComponent;
  let fixture: ComponentFixture<ReviewuserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewuserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
