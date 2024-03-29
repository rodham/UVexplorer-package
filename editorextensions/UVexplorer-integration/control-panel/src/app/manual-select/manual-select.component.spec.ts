import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualSelect } from './manual-select.component';
import { Device } from 'model/uvx/device';
import { createDevice } from '../shared/specUtil';
import { SelectedDevicesMessage } from 'model/message';

describe('ManualSelectComponent', () => {
    let component: ManualSelect;
    let fixture: ComponentFixture<ManualSelect>;
    let device: Device;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ManualSelect]
        }).compileComponents();

        fixture = TestBed.createComponent(ManualSelect);
        component = fixture.componentInstance;

        device = createDevice('1');
        component.devices = [];
        fixture.autoDetectChanges();
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
                removeDevices: []
            },
            '*'
        );

        expect(getSelectedDevicesSpy).toHaveBeenCalledWith();
    });

    // it('test select and deselect of devices', () => {
    //     expect(component.getSelectedDevices()).toEqual([]);
    //     console.log('grid api exists: ', !!component.gridApi);
    //     component.gridApi?.selectAll();
    //
    //     expect(component.getSelectedDevices()).toEqual([device]);
    //     component.gridApi?.deselectAll();
    //
    //     expect(component.getSelectedDevices()).toEqual([]);
    // });
});
