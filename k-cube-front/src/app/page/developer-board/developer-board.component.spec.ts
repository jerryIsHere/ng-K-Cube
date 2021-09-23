import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveloperBoardComponent } from './developer-board.component';

describe('DeveloperBoardComponent', () => {
  let component: DeveloperBoardComponent;
  let fixture: ComponentFixture<DeveloperBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeveloperBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveloperBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
