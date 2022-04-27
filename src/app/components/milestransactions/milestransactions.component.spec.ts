import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MilestransactionsComponent } from './milestransactions.component';

describe('MilestransactionsComponent', () => {
  let component: MilestransactionsComponent;
  let fixture: ComponentFixture<MilestransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MilestransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MilestransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
