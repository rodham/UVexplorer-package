import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NgIf, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    ListDevicesMessage,
    connDeviceGuidsFromListDevMsg,
    devicesFromSerializableDevicesMessage,
    isListDevicesMessage
} from 'model/message';
import { Device, DeviceCategoryEntry, isDevice } from 'model/uvx/device';
import { AgGridAngular } from 'ag-grid-angular';
import {
    ColDef,
    ValueGetterParams,
    GridReadyEvent,
    GetRowIdParams,
    GetRowIdFunc,
    GridApi,
    RowDataUpdatedEvent,
    SizeColumnsToFitGridStrategy,
    SizeColumnsToContentStrategy,
    SizeColumnsToFitProvidedWidthStrategy
} from 'ag-grid-community';
import { SettingsComponent } from '../settings/settings.component';
import { DynamicLayoutSelect } from '../dynamic-layout-select/dl-select.component';

@Component({
    selector: 'app-devices',
    standalone: true,
    imports: [NgIf, NgClass, AgGridAngular, SettingsComponent, FormsModule, DynamicLayoutSelect],
    templateUrl: './devices.component.html'
})
export class DevicesComponent implements OnChanges {
    @Input() devicesMessage?: ListDevicesMessage;
    devices: Device[] = [];
    preselectedDeviceGuids: string[] = [];
    themeClass = 'ag-theme-quartz';
    rowSelection: 'multiple' | 'single' = 'multiple';
    gridApi?: GridApi;
    selectDevicesButtonEnabled = false;
    networkName = '';

    constructor() {
        window.addEventListener('message', (e) => {
            console.log('Received a message from the parent in devices comp.');
            console.log(e.data);

            if (isListDevicesMessage(e.data)) {
                this.initFromMessage(e.data);
                document.getElementById('devicesComponent')!.style.display = 'block';
                console.log('Received devices in component');
            } else {
                console.log('Message did not match correctly');
            }
        });

        if (this.devicesMessage) {
            console.log('Init from message from parent');
            this.initFromMessage(this.devicesMessage);
        }
    }

    ngOnChanges(_changes: SimpleChanges) {
        if (this.devicesMessage) {
            console.log('Init from message from update');
            this.initFromMessage(this.devicesMessage);
        }
    }

    initFromMessage(message: ListDevicesMessage) {
        this.devices = devicesFromSerializableDevicesMessage(message);
        this.preselectedDeviceGuids = connDeviceGuidsFromListDevMsg(message);
        this.networkName = message.networkName;
        if (this.preselectedDeviceGuids.length > 0) {
            this.selectDevicesButtonEnabled = true;
        }
    }

    public columnDefs: ColDef<Device>[] = [
        {
            field: 'custom_name',
            headerName: 'Name',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            filter: 'agTextColumnFilter',
            minWidth: 240
        },
        {
            field: 'ip_address',
            headerName: 'IP Address',
            filter: 'agTextColumnFilter',
            minWidth: 250
        },
        {
            field: 'device_categories',
            headerName: 'Categories',
            filter: 'agTextColumnFilter',
            minWidth: 300,
            valueGetter: (params: ValueGetterParams) => {
                if (!isDevice(params.data) || !params.data.device_categories.entries) {
                    return '';
                }
                return this.appendDeviceCategories(params.data.device_categories.entries);
            }
        }
    ];

    protected autoSizeStrategy:
        | SizeColumnsToFitProvidedWidthStrategy
        | SizeColumnsToContentStrategy
        | SizeColumnsToFitGridStrategy = {
        type: 'fitGridWidth',
        defaultMinWidth: 100
    };

    protected onRowSelected() {
        if (this.gridApi!.getSelectedRows().length > 0) {
            console.log('Rows greater than 1');
            this.selectDevicesButtonEnabled = true;
        } else {
            console.log('Rows less than 1');
            this.selectDevicesButtonEnabled = false;
        }
    }

    public checkDevicesLength(): boolean {
        return this.devices.length > 0;
    }

    public appendDeviceCategories(categories: DeviceCategoryEntry[]): string {
        let returnString = categories[0].device_category;
        for (let i = 1; i < categories.length; i++) {
            if (categories[i].device_category == '') {
                continue;
            }
            returnString += ', ' + categories[i].device_category;
        }
        return returnString;
    }

    public getRowId: GetRowIdFunc = (params: GetRowIdParams<Device>) => {
        return params.data.guid;
    };

    protected onGridReady(event: GridReadyEvent) {
        this.gridApi = event.api;
    }

    protected onRowDataUpdated(_event: RowDataUpdatedEvent) {
        this.setPreselectedDevices();
    }

    private setPreselectedDevices() {
        console.log('setPreselectedDevices - this.devices', this.devices);
        for (const device of this.devices) {
            const guid = device.guid;
            console.log('setPreselectedDevices', guid);
            if (!this.gridApi) {
                return;
            }
            if (this.preselectedDeviceGuids.includes(guid)) {
                const node = this.gridApi.getRowNode(guid);
                if (!node) continue; //console.log('Node exists');
                console.log('setting selected', guid);
                node.setSelected(true);
            } else {
                console.log('No matching guid', guid);
            }
        }
        console.log(this.preselectedDeviceGuids);
    }

    public selectDevices() {
        const selectedDevices = this.getSelectedDevices();
        console.log('Api selected rows: ', selectedDevices);
        const removeDevices: string[] = [];
        const selectedDeviceGuids = selectedDevices.map((d) => d.guid);
        console.log(selectedDeviceGuids);
        console.log('Visible connected device guids to check for removal: ', this.preselectedDeviceGuids);
        for (const guid of this.preselectedDeviceGuids) {
            if (!selectedDeviceGuids.includes(guid)) {
                removeDevices.push(guid);
            }
        }

        parent.postMessage(
            {
                action: 'selectDevices',
                devices: selectedDeviceGuids,
                removeDevices: removeDevices
            },
            '*'
        );
        document.getElementById('devicesComponent')!.style.display = 'none';
    }

    public getSelectedDevices(): Device[] {
        const selectedDevices: Device[] = [];
        const selectedRows = this.gridApi?.getSelectedRows();
        if (selectedRows) {
            for (const row of selectedRows) {
                if (isDevice(row)) selectedDevices.push(row);
            }
        }
        return selectedDevices;
    }

    public changeSettings() {
        parent.postMessage(
            {
                action: 'loadMapSettings'
            },
            '*'
        );

        document.getElementById('devicesComponent')!.style.display = 'none';
    }

    public relistNetworks() {
        parent.postMessage(
            {
                action: 'relistNetworks'
            },
            '*'
        );

        document.getElementById('devicesComponent')!.style.display = 'none';
    }
}
