import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GetRowIdParams, GetRowIdFunc, GridApi } from 'ag-grid-community';
import { Device } from 'model/uvx/device';
import { DynSelectionDirective, dynSelectionValidator } from '../shared/dyn-selection.directive';

@Component({
    selector: 'dl-select',
    standalone: true,
    imports: [NgIf, AgGridAngular, NgFor, FormsModule, DynSelectionDirective, ReactiveFormsModule, NgClass],
    templateUrl: './dl-select.component.html'
})
export class DynamicLayoutSelect implements OnChanges, OnInit {
    @Input() devices!: Device[];
    deviceCategories?: Map<string, string[]>;
    dynamicSelectForm!: FormGroup;
    categoryRows: { cat: string; count: number }[] = [];
    allCatsSelected = false;
    drawerSelection = 'devCat';
    themeClass = 'ag-theme-quartz';
    rowSelection: 'multiple' | 'single' = 'multiple';
    gridApi?: GridApi;
    // ipSelection!: FormControl;
    vlanSelection!: FormControl;
    hostSelection!: FormControl;
    oidSelection!: FormControl;
    private ipRegEx =
        /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d).?\b){4}(\/(8|16|24))?(-((25[0-5]|(2[0-4]|1\d|[1-9]|)\d).?\b){4}(\/(8|16|24))?)?$/;
    private hostRegEx = /^([a-zA-Z*?])*$/;

    ngOnInit(): void {
        this.dynamicSelectForm = new FormGroup({
            ipSelection: new FormControl('', {
                validators: [Validators.minLength(5), dynSelectionValidator(this.ipRegEx)],
                updateOn: 'blur'
            }),
            vlanSelection: new FormControl('', {
                validators: [Validators.minLength(3)],
                updateOn: 'blur'
            }),
            hostSelection: new FormControl('', {
                validators: [Validators.minLength(3), dynSelectionValidator(this.hostRegEx)],
                updateOn: 'blur'
            }),
            oidSelection: new FormControl('', {
                validators: [Validators.minLength(4)],
                updateOn: 'blur'
            })
        });
    }

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

    setupCategories() {
        console.log('Setting up categories');
        this.deviceCategories = this.getDeviceCategories(this.devices);
        // TODO: get any existing settings from the filter data collection
        for (const [key, val] of this.deviceCategories) {
            console.log('Adding category row: ', key, val.length);
            this.categoryRows.push({ cat: key, count: val.length });
        }
    }

    ngOnChanges(_changes: SimpleChanges) {
        console.log('ng changes');
        this.setupCategories();
        if (this.gridApi) {
            this.gridApi.setGridOption('rowData', this.categoryRows);
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

    get ipSelection() {
        return this.dynamicSelectForm.get('ipSelection')!;
    }
}
