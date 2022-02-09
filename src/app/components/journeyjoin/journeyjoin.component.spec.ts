import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JourneyjoinComponent } from './journeyjoin.component';

describe('JourneyjoinComponent', () => {
  let component: JourneyjoinComponent;
  let fixture: ComponentFixture<JourneyjoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JourneyjoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JourneyjoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
