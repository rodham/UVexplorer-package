import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormsModule, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GetRowIdParams, GetRowIdFunc, GridApi } from 'ag-grid-community';
import { Device, DeviceCategoryFilter, DeviceFilter, IpRange, IpScope, Subnet } from 'model/uvx/device';
import { DynSelectionDirective, dynSelectionValidator } from '../shared/dyn-selection.directive';

interface CatRow {
    cat: string;
    count: number;
}

@Component({
    selector: 'dl-select',
    standalone: true,
    imports: [NgIf, AgGridAngular, NgFor, FormsModule, DynSelectionDirective, ReactiveFormsModule, NgClass],
    templateUrl: './dl-select.component.html'
})
export class DynamicLayoutSelect implements OnChanges, OnInit {
    @Input({ required: true }) devices!: Device[];
    deviceCategories?: Map<string, string[]>;
    dynamicSelectForm!: FormGroup;
    categoryRows: CatRow[] = [];
    allCatsSelected = false;
    drawerSelection = 'devCat';
    themeClass = 'ag-theme-quartz';
    rowSelection: 'multiple' | 'single' = 'multiple';
    gridApi?: GridApi<CatRow>;
    private ipRegEx =
        /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d).?\b){4}(\/(8|16|24))?(-((25[0-5]|(2[0-4]|1\d|[1-9]|)\d).?\b){4}(\/(8|16|24))?)?$/;
    private hostRegEx = /^([a-zA-Z0-9*?\-_])*$/;
    private oidRegEx = /^([0-2])((\.0)|(\.[1-9][0-9]*))*$/;

    ngOnInit(): void {
        this.dynamicSelectForm = new FormGroup({
            ipSelection: new FormControl('', {
                validators: [Validators.minLength(5), dynSelectionValidator(this.ipRegEx)],
                updateOn: 'blur'
            }),
            vlanSelection: new FormControl('', {
                validators: [Validators.minLength(3), dynSelectionValidator(this.hostRegEx)],
                updateOn: 'blur'
            }),
            hostSelection: new FormControl('', {
                validators: [Validators.minLength(3), dynSelectionValidator(this.hostRegEx)],
                updateOn: 'blur'
            }),
            oidSelection: new FormControl('', {
                validators: [Validators.minLength(3), dynSelectionValidator(this.oidRegEx)],
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
        this.categoryRows = [];
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

    public getRowId: GetRowIdFunc = (params: GetRowIdParams<CatRow>) => {
        return params.data.cat;
    };

    protected onGridReady(event: GridReadyEvent) {
        this.gridApi = event.api;
    }

    get ipSelection() {
        return this.dynamicSelectForm.get('ipSelection')!;
    }

    get vlanSelection() {
        return this.dynamicSelectForm.get('vlanSelection')!;
    }

    get hostSelection() {
        return this.dynamicSelectForm.get('hostSelection')!;
    }

    get oidSelection() {
        return this.dynamicSelectForm.get('oidSelection')!;
    }

    confirmSelection() {
        let ipOut;
        let vlanOut;
        let hostOut;
        let oidOut;
        let categoriesOut: DeviceCategoryFilter | undefined;

        const ipIn: unknown = this.ipSelection.value;
        if (ipIn && typeof ipIn === 'string') {
            ipOut = this.parseIpSelection(ipIn);
        }

        const vlanIn: unknown = this.vlanSelection.value;
        if (vlanIn && typeof vlanIn === 'string') {
            vlanOut = this.parseVlanSelection(vlanIn);
        }

        const hostIn: unknown = this.hostSelection.value;
        if (hostIn && typeof hostIn === 'string') {
            hostOut = this.parseHostSelection(hostIn);
        }

        const oidIn: unknown = this.oidSelection.value;
        if (oidIn && typeof oidIn === 'string' && oidIn !== '') {
            oidOut = this.parseOidSelection(oidIn);
        }

        const categoriesIn = this.gridApi?.getSelectedRows();
        if (categoriesIn) {
            categoriesOut = this.parseCatSelection(categoriesIn);
        }

        console.log('IP out: ', ipOut);
        console.log('VLAN out: ', vlanOut);
        console.log('Host out: ', hostOut);
        console.log('OID out: ', oidOut);
        console.log('Cats out: ', categoriesOut);

        const filter = new DeviceFilter({
            include_scope: 'AllDevices',
            device_names: hostOut,
            ip_scopes: ipOut ? [ipOut] : undefined,
            device_categories: categoriesOut,
            vlans: vlanOut,
            system_oids: oidOut
        });

        console.log('Dyn filter: ', JSON.stringify(filter));
        // TODO: send data out to parent component? or just send back to extension code to be saved?
    }

    private parseIpSelection(ipInput: string) {
        console.log(ipInput);
        const ipOut: IpScope = {};
        const ipSelections = ipInput.split(/[\s,\n]+/);

        for (const ip of ipSelections) {
            if (ip.includes('-')) {
                const rangeVals = ip.split('-');
                if (rangeVals.length < 2) {
                    console.log('IP range incomplete');
                    continue;
                }
                if (rangeVals.length > 2) {
                    console.log('IP range too long', rangeVals);
                    continue;
                }
                const range: IpRange = { min_address: rangeVals[0], max_address: rangeVals[1] };
                if (!ipOut.ranges) ipOut.ranges = [];
                ipOut.ranges.push(range);
            } else if (ip.includes('/')) {
                const subnetVals = ip.split('/');
                if (subnetVals.length < 2) {
                    console.log('IP subnet incomplete: ', subnetVals);
                    continue;
                }
                if (subnetVals.length > 2) {
                    console.log('IP subnet too long: ', subnetVals);
                    continue;
                }
                const subnet: Subnet = { ip_address: subnetVals[0], subnet_mask: subnetVals[1] };
                if (!ipOut.subnets) ipOut.subnets = [];
                ipOut.subnets.push(subnet);
            } else {
                if (!ipOut.addresses) ipOut.addresses = [];
                ipOut.addresses.push(ip);
            }
        }

        console.log('ipOut: ', JSON.stringify(ipOut));
        return ipOut;
    }

    private parseVlanSelection(vlanInput: string) {
        console.log(vlanInput);
        const vlanOut: string[] = [];
        const vlans = vlanInput.split(/[\s,\n]+/);

        for (const vlan of vlans) {
            vlanOut.push(vlan);
        }

        console.log('vlanOut: ', JSON.stringify(vlanOut));
        return vlanOut;
    }

    private parseHostSelection(hostInput: string) {
        console.log(hostInput);
        const hostOut: string[] = [];
        const hosts = hostInput.split(/[\s,\n]+/);

        for (const host of hosts) {
            hostOut.push(host);
        }

        console.log('hostOut: ', JSON.stringify(hostOut));
        return hostOut;
    }

    private parseOidSelection(oidInput: string) {
        console.log(oidInput);
        const oidOut: string[] = [];
        const oids = oidInput.split(/[\s,\n]+/);

        for (const oid of oids) {
            oidOut.push(oid);
        }

        console.log('oidOut: ', JSON.stringify(oidOut));
        return oidOut;
    }

    private parseCatSelection(selectedRows: CatRow[]) {
        console.log(selectedRows);
        const catOut: DeviceCategoryFilter = { category_filter_type: 'Any', category_names: [] };

        for (const row of selectedRows) {
            catOut.category_names.push(row.cat);
        }

        console.log('catOut: ', catOut);
        return catOut;
    }
}
