import { TestBed } from '@angular/core/testing';
import { FirstComponent } from './first.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirstComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(FirstComponent);
    const app = fixture.componentInstance;

    expect(app).toBeTruthy();
  });

  it(`should have the 'control-panel' title`, () => {
    const fixture = TestBed.createComponent(FirstComponent);
    const app = fixture.componentInstance;

    expect(app.title).toEqual('control-panel');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(FirstComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, control-panel');
  });
});
