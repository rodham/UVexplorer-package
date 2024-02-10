import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectedDevicesComponent } from './connectedDevices.component';
import { By } from '@angular/platform-browser';

describe('Connected Devices Component', () => {
  let fixture: ComponentFixture<ConnectedDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedDevicesComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ConnectedDevicesComponent);
  });

  it('should create the component', () => {
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should have correct title', () => {
    const component = fixture.componentInstance;

    expect(component.title).toEqual('connectedDevices');
  });

  it('should render loading text before receiving devices list', () => {
    fixture.detectChanges();
    const compiled = fixture.debugElement;
    const loadingElem = compiled.query(By.css('#loadingText'));
    const htmlElem = loadingElem.nativeElement as HTMLElement;

    expect(htmlElem.textContent).toEqual('Loading...');
  });
});
