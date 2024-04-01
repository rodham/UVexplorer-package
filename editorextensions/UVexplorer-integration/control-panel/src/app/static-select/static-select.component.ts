import { Component, Input } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { Device, DeviceCategoryEntry, getNameFromDevice, isDevice } from 'model/uvx/device';
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
import { NgClass } from '@angular/common';

@Component({
    selector: 'static-select',
    standalone: true,
    imports: [AgGridAngular, NgClass],
    templateUrl: './static-select.component.html'
})
export class StaticSelect {
    @Input({ required: true }) devices!: Device[];
    @Input() preselectedDeviceGuids: string[] = [];
    themeClass = 'ag-theme-quartz';
    rowSelection: 'multiple' | 'single' = 'multiple';
    gridApi?: GridApi;
    selectDevicesButtonEnabled = true;

    public columnDefs: ColDef<Device>[] = [
        {
            field: 'custom_name',
            valueGetter: (params) => {
                return params.data ? getNameFromDevice(params.data) : '';
            },
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
        // When coming from the Networks component, the data is ready before the grid
        this.setPreselectedDevices();
    }

    protected onRowDataUpdated(event: RowDataUpdatedEvent) {
        this.gridApi = event.api;
        // When coming from the 'Add/Remove Connected Devices' option, the grid is ready before the data
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
    }
}
