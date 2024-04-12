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
import { NgClass, NgIf } from '@angular/common';

@Component({
    selector: 'static-select',
    standalone: true,
    imports: [AgGridAngular, NgClass, NgIf],
    templateUrl: './static-select.component.html'
})

/*
 * Contains the rest of the functionality to control the static membership selection
 */
export class StaticSelect {
    @Input({ required: true }) devices!: Device[];
    @Input() preselectedDeviceGuids: string[] = [];
    themeClass = 'ag-theme-quartz';
    rowSelection: 'multiple' | 'single' = 'multiple';
    gridApi?: GridApi;
    selectDevicesButtonEnabled = true;
    selected = false;

    /*
     * Defines the columns to be displayed in the devices grid
     */
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

    /*
     * Defines a way for the grid to be autosized to alleviate overlapping or crunched displaying of device grid
     */
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

    /*
    * Creates a string of comma separated device categories for a single device
    */
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

    /*
    * Retrieve the row ID for a given row of the table
    */
    public getRowId: GetRowIdFunc = (params: GetRowIdParams<Device>) => {
        return params.data.guid;
    };

    /*
    * Called once the list of devices is prepared. Sets the preselected devices to be checked
    */
    protected onGridReady(event: GridReadyEvent) {
        this.gridApi = event.api;
        // When coming from the Networks component, the data is ready before the grid
        this.setPreselectedDevices();
    }

    /*
    * Updates the table when a change is made to data
    */
    protected onRowDataUpdated(event: RowDataUpdatedEvent) {
        this.gridApi = event.api;
        // When coming from the 'Add/Remove Connected Devices' option, the grid is ready before the data
        this.setPreselectedDevices();
    }

    /*
    * Selects each row in the table if the device is in the preselectedDeviceGuids list
    */
    private setPreselectedDevices() {
        for (const device of this.devices) {
            const guid = device.guid;
            if (!this.gridApi) {
                return;
            }
            if (this.preselectedDeviceGuids.includes(guid)) {
                const node = this.gridApi.getRowNode(guid);
                if (!node) continue; //console.log('Node exists');
                node.setSelected(true);
            } else {
                // console.log('No matching guid', guid);
            }
        }
        console.log(this.preselectedDeviceGuids);
    }

    /*
    * Returns a list of Device objects for each device selected in the table
    */
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

    /*
    * Retrieves a list of all selected devices and a list of devices that are in preselectedDeviceGuids but
    * is not currently selected. It then sends both these lists to the modal to be reflected on the document
    */
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

        this.selected = true;

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
