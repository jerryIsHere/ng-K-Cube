import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheGraphComponent } from './the-graph.component';

describe('TheGraphComponent', () => {
  let component: TheGraphComponent;
  let fixture: ComponentFixture<TheGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TheGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TheGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
