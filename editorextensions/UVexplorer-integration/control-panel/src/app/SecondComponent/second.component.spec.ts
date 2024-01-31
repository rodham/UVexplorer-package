import { TestBed } from '@angular/core/testing';
import { SecondComponent } from './second.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondComponent]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(SecondComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'control-panel' title`, () => {
    const fixture = TestBed.createComponent(SecondComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('control-panel');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(SecondComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, control-panel');
  });
});
