import { TestBed } from '@angular/core/testing';
import { NetworksComponent } from './networks.component';
import { NetworkSummary, AgentSummary, DiscoverySummary, DiscoveryRunSummary } from '../../../../model/uvexplorer-model';
import { LoadNetworkMessage } from '../../../../model/message';

describe('NetworksComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworksComponent]
    }).compileComponents();
  });

  it('should create the network component', () => {
    const fixture = TestBed.createComponent(NetworksComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it(`should have the 'control-panel' title`, () => {
    const fixture = TestBed.createComponent(NetworksComponent);
    const component = fixture.componentInstance;

    expect(component.title).toEqual('networks');
  });

  it('should call parent.postMessage on loadNetwork', () => {
    const fixture = TestBed.createComponent(NetworksComponent);
    const component = fixture.componentInstance;

    const postMessageSpy: jasmine.Spy<(message: LoadNetworkMessage, targetOrigin: string) => void> = spyOn(
      window.parent,
      'postMessage',
    );

    component.selectedNetwork = buildNetworkSummary();
    component.loadNetwork();

    expect(postMessageSpy).toHaveBeenCalledWith({
      action: 'loadNetwork',
      name: component.selectedNetwork.name,
      network_guid: component.selectedNetwork.guid
    }, '*');
  });
  /*it('should catch message event', () => {
    const fixture = TestBed.createComponent(NetworksComponent);
    const component = fixture.componentInstance;

    component.trigger
    spyOnProperty(component, 'handleMessageEvent').and.callThrough();
    let networkSummary = buildNetworkSummary();
    let event = new  CustomEvent("message", {"detail" : {
      "action" : "listNetworks",
      "network_summaries": [networkSummary]}});
    window.dispatchEvent(event);
    fixture.detectChanges();
    expect(component.network_summaries).toEqual([networkSummary]);
  });*/


});

function buildNetworkSummary(): NetworkSummary {

  const discoveryRunSummary: DiscoveryRunSummary = {
    guid: "",
    start_time: "",
    end_time: ""
  };

  const discoverySummary: DiscoverySummary = {
    guid: "",
    created_time: "",
    modified_time: "",
    name: "",
    discovery_run_summaries: [discoveryRunSummary]
  };

  const agentSummary: AgentSummary = {
    guid: "",
    created_time: "",
    modified_time: "",
    name: "",
    description: "",
    discovery_summaries: [discoverySummary]
  };


  const networkSummary: NetworkSummary = {
    guid : "some random guid",
    created_time: "created time",
    modified_time: "modified time",
    name: "test network",
    description: "network description",
    agent_summaries: [agentSummary]
  };

  return networkSummary;
}
