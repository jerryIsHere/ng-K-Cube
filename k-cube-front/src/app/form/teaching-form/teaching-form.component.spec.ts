import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachingFormComponent } from './teaching-form.component';

describe('TeachingFormComponent', () => {
  let component: TeachingFormComponent;
  let fixture: ComponentFixture<TeachingFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeachingFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
