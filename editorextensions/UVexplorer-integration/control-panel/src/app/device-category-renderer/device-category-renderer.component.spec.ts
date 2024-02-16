import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceCategoryRendererComponent } from './device-category-renderer.component';

describe('DeviceCategoryRendererComponent', () => {
  let component: DeviceCategoryRendererComponent;
  let fixture: ComponentFixture<DeviceCategoryRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceCategoryRendererComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceCategoryRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
