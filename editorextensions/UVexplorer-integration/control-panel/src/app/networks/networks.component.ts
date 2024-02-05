import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NetworkSummary } from '../../../../model/uvexplorer-model';
import { NgForOf } from '@angular/common';
import { isListNetworksMessage } from '../../../../model/message';

@Component({
  selector: 'networks',
  standalone: true,
  imports: [FormsModule, NgForOf],
  templateUrl: './networks.component.html'
})
export class NetworksComponent {
  title = 'networks';
  network_summaries: NetworkSummary[] = [];
  selectedNetwork: NetworkSummary = {guid: '', name: '', description: '', agent_summaries: [], created_time: '', modified_time: ''};

  constructor() {
    window.addEventListener('message', (e) => {
      console.log('Received a message from the parent.');
      console.log(e.data);
      if (isListNetworksMessage(e.data)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        this.network_summaries = JSON.parse(e.data.network_summaries);
      }
    });
  }

  loadNetwork() {
    parent.postMessage(
      {
        action: 'loadNetwork',
        name: this.selectedNetwork.name,
        network_guid: this.selectedNetwork.guid
      },
      '*'
    );
  }
}
