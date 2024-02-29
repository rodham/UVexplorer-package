import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import {
  connDeviceGuidsFromListDevMsg,
  devicesFromSerializableDevicesMessage,
  isListDevicesMessage
} from 'model/message';
import { Device, DeviceCategoryEntry, isDevice } from 'model/uvexplorer-devices-model';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ColDef,
  ValueGetterParams,
  GridReadyEvent,
  GetRowIdParams,
  GetRowIdFunc,
  GridApi,
  RowDataUpdatedEvent
} from 'ag-grid-community';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [NgIf, NgFor, AgGridAngular, SettingsComponent],
  templateUrl: './devices.component.html'
})
export class DevicesComponent {
  devices: Device[] = [];
  selectingDevices = false;
  visibleConnectedDeviceGuids: string[] = [];
  themeClass = 'ag-theme-quartz';
  rowSelection: 'multiple' | 'single' = 'multiple';
  private gridApi?: GridApi;

  constructor() {
    window.addEventListener('message', (e) => {
      console.log('Received a message from the parent.');
      console.log(e.data);

      if (isListDevicesMessage(e.data)) {
        this.devices = devicesFromSerializableDevicesMessage(e.data);
        this.visibleConnectedDeviceGuids = connDeviceGuidsFromListDevMsg(e.data);
        this.selectingDevices = true;
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
          return '';
        }
        console.log('Device GUID: ', params.data.guid);
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
      returnString += ', ' + categories[i].device_category;
    }
    return returnString;
  }

  public getRowId: GetRowIdFunc = (params: GetRowIdParams<Device>) => {
    console.log('Setting row id for guid: ', params.data.guid);
    return params.data.guid;
  };

  protected onGridReady(event: GridReadyEvent) {
    this.gridApi = event.api;
  }

  protected onRowDataUpdated(_event: RowDataUpdatedEvent) {
    this.setPreselectedDevices();
  }

  private setPreselectedDevices() {
    for (const device of this.devices) {
      const guid = device.guid;
      console.log('Checking node with guid: ', guid);
      if (!this.gridApi) {
        console.log('Grid not ready');
        return;
      }
      if (this.visibleConnectedDeviceGuids.includes(guid)) {
        const node = this.gridApi.getRowNode(guid);
        if (node) console.log('Node exists');
        else {
          console.log('Node does not exist');
          continue;
        }
        node.setSelected(true);
      }
    }
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
    console.log('Visible connected device guids to check for removal: ', this.visibleConnectedDeviceGuids);
    for (const guid of this.visibleConnectedDeviceGuids) {
      if (!selectedDeviceGuids.includes(guid)) {
        removeDevices.push(guid);
      }
    }
    console.log('Selected devices: ', selectedDeviceGuids);
    console.log('Devices to remove: ', removeDevices);
    parent.postMessage(
      {
        action: 'selectDevices',
        devices: selectedDevices,
        removeDevices
      },
      '*'
    );

    this.selectingDevices = false;
  }
}
