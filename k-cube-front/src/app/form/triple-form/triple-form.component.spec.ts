import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripleFormComponent } from './triple-form.component';

describe('TripleFormComponent', () => {
  let component: TripleFormComponent;
  let fixture: ComponentFixture<TripleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripleFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
