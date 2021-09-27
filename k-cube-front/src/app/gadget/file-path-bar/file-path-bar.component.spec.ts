import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePathBarComponent } from './file-path-bar.component';

describe('FilePathBarComponent', () => {
  let component: FilePathBarComponent;
  let fixture: ComponentFixture<FilePathBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilePathBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePathBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
