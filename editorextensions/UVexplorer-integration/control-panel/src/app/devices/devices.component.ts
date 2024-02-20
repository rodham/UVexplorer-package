import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { isListDevicesMessage } from '../../../../model/message';
import { Device, DeviceCategoryEntry, isDevice } from '../../../../model/uvexplorer-model';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, RowSelectedEvent, ValueGetterParams } from 'ag-grid-community';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [NgIf, NgFor, AgGridAngular],
  templateUrl: './devices.component.html',
})
export class DevicesComponent {
  devices: Device[] = [];
  selectedDevices: Device[] = [];
  themeClass = 'ag-theme-quartz';
  rowSelection: 'multiple' | 'single' = 'multiple';

  constructor() {
    window.addEventListener('message', (e) => {
      console.log('Received a message from the parent.');
      console.log(e.data);
      if (isListDevicesMessage(e.data)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.devices = JSON.parse(e.data.devices);
        console.log('Received devices in component');
      }
    });
  }

  public columnDefs: ColDef<Device>[] = [
    {
      field: 'ip_address',
      headerName: 'IP Address',
      headerCheckboxSelection: true,
      checkboxSelection: true,
      filter: 'agTextColumnFilter',
      maxWidth: 180
    },
    {
      field: 'mac_address',
      headerName: 'MAC Address',
      filter: 'agTextColumnFilter',
      maxWidth: 150
    },
    {
      field: 'custom_name',
      headerName: 'Custom Name',
      filter: 'agTextColumnFilter'
    },
    {
      field: 'device_categories',
      headerName: 'Categories',
      filter: 'agTextColumnFilter',
      minWidth: 265,
      valueGetter: (params: ValueGetterParams) => {
        if (!isDevice(params.data) || !params.data.device_categories.entries) {
          return "";
        }
        console.log("Device GUID: ", params.data.guid);
        return this.appendDeviceCategories(params.data.device_categories.entries);
      }
    }
  ];

  public appendDeviceCategories(categories: DeviceCategoryEntry[]): string {
    let returnString = categories[0].device_category;
    for (let i = 1; i < categories.length; i++) {
      if (categories[i].device_category == '') {
        continue;
      }
      returnString += ", " + categories[i].device_category;
    }
    return returnString;
  }

  protected onRowSelected(event: RowSelectedEvent) {
    if (isDevice(event.data)) {
      this.addRemoveRowSelection(event.data, event.node.isSelected()!);
    }
  }

  public addRemoveRowSelection(device: Device, selected: boolean) {
    if (selected) {
      console.log("selected: ", selected)
      this.selectedDevices.push(device);
    } else {
      console.log("selected: ", selected)
      const index = this.selectedDevices.findIndex((obj) => obj === device);
      this.selectedDevices.splice(index, 1);
    }
  }

  public selectDevices() {
    parent.postMessage(
      {
        action: 'selectDevices',
        devices: JSON.stringify(this.selectedDevices)
      },
      '*'
    );
  }
}
