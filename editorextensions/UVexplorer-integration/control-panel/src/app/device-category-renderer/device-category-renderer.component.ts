import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { Device, DeviceCategoryEntry } from 'model/uvexplorer-model';

@Component({
  standalone: true,
  template: '<span>{{ this.displayValue }}</span>'
})
export class DeviceCategoryRendererComponent implements ICellRendererAngularComp {
  public displayValue!: string;

  agInit(params: ICellRendererParams<Device>): void {
    if (!params.data!.device_categories.entries) {
      return;
    }
    const categories: DeviceCategoryEntry[] = params.data!.device_categories.entries;
    this.displayValue = categories[0].device_category;
    for (let i = 1; i < categories.length; i++) {
      if (categories[i].device_category == '') {
        continue;
      }
      this.displayValue += ',' + categories[i].device_category;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return false;
  }
}
