import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevicesComponent } from './devices.component';
import { Device } from 'model/uvx/device';
import { createDevice } from '../shared/specUtil';

describe('DevicesComponent', () => {
    let component: DevicesComponent;
    let fixture: ComponentFixture<DevicesComponent>;
    let device: Device;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DevicesComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DevicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        device = createDevice('1');
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('validate appended DeviceCategories', () => {
        const expectedValue = 'device1, device11';

        expect(expectedValue).toEqual(component.appendDeviceCategories(device.device_categories.entries!));
    });
});
