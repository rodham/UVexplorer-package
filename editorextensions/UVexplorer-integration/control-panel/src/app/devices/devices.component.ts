import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { isListDevicesMessage } from '../../../../model/message';
import { Device } from '../../../../model/uvexplorer-model';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, RowSelectedEvent } from 'ag-grid-community';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [NgIf, NgFor, AgGridAngular],
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css'
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
    },
    {
      field: 'mac_address',
      headerName: 'MAC Address',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'custom_name',
      headerName: 'Custom Name',
      filter: 'agTextColumnFilter',
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      filter: 'agTextColumnFilter',
    }
  ];

  protected onRowSelected(event: RowSelectedEvent) {
    if (event.node.isSelected() && event.node.data instanceof Device) {
      this.selectedDevices.push(event.node.data);
    } else {
      const index = this.selectedDevices.findIndex((obj) => obj === event.node.data);
      this.selectedDevices.splice(index, 1);
    }

    console.log("Selected length ", this.selectedDevices.length);
  }

  protected selectDevices() {
    parent.postMessage(
    {
      action: 'selectDevices',
      devices: JSON.stringify(this.selectedDevices)
    }, '*');
  }
}
