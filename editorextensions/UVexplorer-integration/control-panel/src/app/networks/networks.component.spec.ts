import { TestBed } from '@angular/core/testing';
import { NetworksComponent } from './networks.component';
import { NetworkSummary, AgentSummary, DiscoverySummary, DiscoveryRunSummary } from '../../../../model/uvexplorer-model';

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

    let postMessageSpy: jasmine.Spy<(message: any, targetOrigin: string) => void> = spyOn(
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
});

function buildNetworkSummary(): NetworkSummary {

  let discoveryRunSummary: DiscoveryRunSummary = {
    guid: "",
    start_time: "",
    end_time: ""
  };

  let discoverySummary: DiscoverySummary = {
    guid: "",
    created_time: "",
    modified_time: "",
    name: "",
    discovery_run_summaries: [discoveryRunSummary]
  };

  let agentSummary: AgentSummary = {
    guid: "",
    created_time: "",
    modified_time: "",
    name: "",
    description: "",
    discovery_summaries: [discoverySummary]
  };


  let networkSummary: NetworkSummary = {
    guid : "some random guid",
    created_time: "created time",
    modified_time: "modified time",
    name: "test network",
    description: "network description",
    agent_summaries: [agentSummary]
  };

  return networkSummary;
}
