import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NetworkSummary } from '../../../../model/uvexplorer-model';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'networks',
  standalone: true,
  imports: [FormsModule, NgForOf],
  templateUrl: './networks.component.html'
})
export class NetworksComponent {
  title = 'networks';
  networks: NetworkSummary[] = [];
  selectedNetwork = '';

  loadNetwork() {
    parent.postMessage(
      {
        action: 'loadNetwork',
        network_guid: this.selectedNetwork
      },
      '*'
    );
    console.log('Successfully sent message to parent');
  }
}
