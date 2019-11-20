import * as plugins from './docker.plugins';
import * as interfaces from './interfaces';

import { DockerHost } from './docker.classes.host';
import { DockerService } from './docker.classes.service';

export class DockerNetwork {
  public static async getNetworks(dockerHost: DockerHost): Promise<DockerNetwork[]> {
    const dockerNetworks: DockerNetwork[] = [];
    const response = await dockerHost.request('GET', '/networks');
    for (const networkObject of response.body) {
      const dockerNetwork = new DockerNetwork(dockerHost);
      Object.assign(dockerNetwork, networkObject);
      dockerNetworks.push(dockerNetwork);
    }
    return dockerNetworks;
  }

  public static async getNetworkByName(dockerHost: DockerHost, dockerNetworkNameArg: string) {
    const networks = await DockerNetwork.getNetworks(dockerHost);
    return networks.find(dockerNetwork => dockerNetwork.Name === dockerNetworkNameArg);
  }

  public static async createNetwork(
    dockerHost: DockerHost,
    networkCreationDescriptor: interfaces.INetworkCreationDescriptor
  ): Promise<DockerNetwork> {
    const response = await dockerHost.request('POST', '/networks/create', {
      Name: networkCreationDescriptor.Name,
      CheckDuplicate: true,
      Driver: 'overlay',
      EnableIPv6: false,
      /* IPAM: {
        Driver: 'default',
        Config: [
          {
            Subnet: `172.20.${networkCreationDescriptor.NetworkNumber}.0/16`,
            IPRange: `172.20.${networkCreationDescriptor.NetworkNumber}.0/24`,
            Gateway: `172.20.${networkCreationDescriptor.NetworkNumber}.11`
          }
        ]
      }, */
      Internal: false,
      Attachable: true,
      Ingress: false
    });
    if (response.statusCode < 300) {
      plugins.smartlog.defaultLogger.log('info', 'Created network successfully');
      return await DockerNetwork.getNetworkByName(dockerHost, networkCreationDescriptor.Name);
    } else {
      plugins.smartlog.defaultLogger.log(
        'error',
        'There has been an error creating the wanted network'
      );
      return null;
    }
  }

  // INSTANCE
  // references
  public dockerHost: DockerHost;

  // properties
  public Name: string;
  public Id: string;
  public Created: string;
  public Scope: string;
  public Driver: string;
  public EnableIPv6: boolean;
  public Internal: boolean;
  public Attachable: boolean;
  public Ingress: false;
  public IPAM: {
    Driver: 'default' | 'bridge' | 'overlay';
    Config: [
      {
        Subnet: string;
        IPRange: string;
        Gateway: string;
      }
    ];
  };

  constructor(dockerHostArg: DockerHost) {
    this.dockerHost = dockerHostArg;
  }

  /**
   * removes the network
   */
  public async remove() {
    const response = await this.dockerHost.request('DELETE', `/networks/${this.Id}`);
  }

  public async getContainersOnNetwork(): Promise<
    Array<{
      Name: string;
      EndpointID: string;
      MacAddress: string;
      IPv4Address: string;
      IPv6Address: string;
    }>
  > {
    const returnArray = [];
    const response = await this.dockerHost.request('GET', `/networks/${this.Id}`);
    for (const key of Object.keys(response.body.Containers)) {
      returnArray.push(response.body.Containers[key]);
    }

    return returnArray;
  }

  public async getContainersOnNetworkForService(serviceArg: DockerService) {
    const containersOnNetwork = await this.getContainersOnNetwork();
    const containersOfService = containersOnNetwork.filter(container => {
      return container.Name.startsWith(serviceArg.Spec.Name);
    });
    return containersOfService;
  }
}
