import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GetRowIdParams, GetRowIdFunc, GridApi } from 'ag-grid-community';
import { Device } from 'model/uvx/device';

@Component({
    selector: 'dl-select',
    standalone: true,
    imports: [NgIf, AgGridAngular, NgFor, FormsModule],
    templateUrl: './dl-select.component.html'
})
export class DynamicLayoutSelect implements OnChanges {
    @Input() devices!: Device[];
    deviceCategories?: Map<string, string[]>;
    categorySelection?: Map<string, boolean>;
    categoryRows: { cat: string; count: number }[] = [];
    allCatsSelected = false;
    drawerSelection = 'devCat';
    themeClass = 'ag-theme-quartz';
    rowSelection: 'multiple' | 'single' = 'multiple';
    gridApi?: GridApi;

    private getDeviceCategories(devices: Device[]) {
        const deviceCategories = new Map<string, string[]>();
        for (const device of devices) {
            const entries = device.device_categories.entries;
            if (!entries) continue;
            for (const entry of entries) {
                const cat = entry.device_category;
                let catDevices = deviceCategories.get(cat);
                if (catDevices) {
                    catDevices.push(device.guid);
                } else {
                    catDevices = [device.guid];
                }
                deviceCategories.set(cat, catDevices);
            }
        }
        return deviceCategories;
    }

    // protected compVisible(compName: string) {
    //     return this.drawerSelection === compName;
    // }

    setupCategories() {
        console.log('Setting up categories');
        this.deviceCategories = this.getDeviceCategories(this.devices);
        this.categorySelection = new Map<string, boolean>();
        // TODO: get any existing settings from the filter data collection
        for (const [key, val] of this.deviceCategories) {
            console.log('Adding category row: ', key, val.length);
            this.categoryRows.push({ cat: key, count: val.length });
            this.categorySelection.set(key, false);
        }
    }

    ngOnChanges(_changes: SimpleChanges) {
        console.log('ng changes');
        this.setupCategories();
        if (this.gridApi) {
            this.gridApi.setGridOption('rowData', this.categoryRows);
        }
    }

    selectAllCats() {
        this.allCatsSelected = true;
        if (!this.categorySelection) {
            console.log('Category selection not initialized');
            return;
        }
        for (const cat of this.categorySelection.keys()) {
            this.categorySelection.set(cat, true);
        }
    }

    selectCat(cat: string) {
        if (!this.categorySelection) {
            console.log('Category selection not initialized');
            return;
        }
        const oldVal = this.categorySelection.get(cat);
        this.categorySelection.set(cat, !oldVal);
        this.checkSelectAllCats();
    }

    checkSelectAllCats() {
        if (!this.categorySelection) {
            console.log('Category selection not initialized');
            return;
        }
        if (this.allCatsSelected) {
            this.allCatsSelected = false;
        } else {
            let allSelected = true;
            for (const selection of this.categorySelection.values()) {
                if (!selection) {
                    allSelected = false;
                }
            }
            this.allCatsSelected = allSelected;
        }
    }

    public columnDefs: ColDef<{ cat: string; count: number }>[] = [
        {
            field: 'cat',
            headerName: 'Category',
            headerCheckboxSelection: true,
            checkboxSelection: true,
            filter: 'agTextColumnFilter',
            maxWidth: 180
        },
        {
            field: 'count',
            headerName: 'Count'
        }
    ];

    public getRowId: GetRowIdFunc = (params: GetRowIdParams<{ cat: string; count: number }>) => {
        return params.data.cat;
    };

    protected onGridReady(event: GridReadyEvent) {
        this.gridApi = event.api;
    }
}
