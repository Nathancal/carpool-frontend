import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserpassengerpickuplistComponent } from './userpassengerpickuplist.component';

describe('UserpassengerpickuplistComponent', () => {
  let component: UserpassengerpickuplistComponent;
  let fixture: ComponentFixture<UserpassengerpickuplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserpassengerpickuplistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserpassengerpickuplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
