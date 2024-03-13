import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DevicesComponent } from './devices.component';
import {
    Device,
    DeviceCategories,
    DeviceCategoryEntry,
    DeviceClass,
    ProtocolProfile,
    ProtocolProfileEntry
} from 'model/uvx/device';
import { SelectedDevicesMessage } from 'model/message';

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

    it('should call parent.postMessage on selectDevices', () => {
        const postMessageSpy: jasmine.Spy<(message: SelectedDevicesMessage, targetOrigin: string) => void> = spyOn(
            window.parent,
            'postMessage'
        );

        const getSelectedDevicesSpy: jasmine.Spy<() => Device[]> = spyOn(
            component,
            'getSelectedDevices'
        ).and.returnValue([device]);

        component.preselectedDeviceGuids = [];
        component.selectDevices();

        expect(postMessageSpy).toHaveBeenCalledWith(
            {
                action: 'selectDevices',
                devices: [device.guid],
                autoLayout: true,
                removeDevices: []
            },
            '*'
        );

        expect(getSelectedDevicesSpy).toHaveBeenCalledWith();
    });

    it('validate appended DeviceCategories', () => {
        const expectedValue = 'device1, device11';

        expect(expectedValue).toEqual(component.appendDeviceCategories(device.device_categories.entries!));
    });

    // it('test select and deselect of devices', () => {
    //     expect(component.getSelectedDevices()).toEqual([]);
    //     component.gridApi?.selectAll();
    //
    //     expect(component.getSelectedDevices()).toEqual([device]);
    //     component.gridApi?.deselectAll();
    //
    //     expect(component.getSelectedDevices()).toEqual([]);
    // });
});

function createDevice(increment: string): Device {
    const value = 'device' + increment;
    const protocol = 'protocol' + increment;

    const deviceClass: DeviceClass = {};

    const deviceCategoryEntry: DeviceCategoryEntry = {
        device_category: value,
        source_name: value
    };

    const deviceCategoryEntry2: DeviceCategoryEntry = {
        device_category: value + '1',
        source_name: value
    };

    const deviceCategories: DeviceCategories = {
        entries: [deviceCategoryEntry, deviceCategoryEntry2]
    };

    const protocolProfileEntry: ProtocolProfileEntry = {
        protocol_name: protocol,
        protocol_settings: protocol
    };

    const protocolProfilesArray: ProtocolProfileEntry[] = [protocolProfileEntry];

    const protocolProfile: ProtocolProfile = {
        entries: protocolProfilesArray
    };

    const device: Device = {
        ip_address: value,
        mac_address: value,
        guid: value,
        info_sets: value,
        device_class: deviceClass,
        device_categories: deviceCategories,
        protocol_profile: protocolProfile,
        timestamp: value
    };

    return device;
}
