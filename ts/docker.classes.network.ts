import * as plugins from './docker.plugins';
import * as interfaces from './interfaces';

import { DockerHost } from './docker.classes.host';

export class DockerNetwork {
  public static async getNetworks(dockerHost: DockerHost): Promise<DockerNetwork[]> {
    const dockerNetworks: DockerNetwork[] = [];
    const response = await dockerHost.request('GET', '/networks');
    for (const networkObject of response.body) {
      dockerNetworks.push(new DockerNetwork(dockerHost, networkObject));
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
      IPAM: {
        Driver: 'default',
        Config: [
          {
            Subnet: '172.20.10.0/16',
            IPRange: '172.20.10.0/24',
            Gateway: '172.20.10.11'
          }
        ]
      },
      Internal: true,
      Attachable: true,
      Ingress: false
    });
    if (response.statusCode < 300 ) {
      plugins.smartlog.defaultLogger.log('info', 'Created network successfully');
      return await DockerNetwork.getNetworkByName(dockerHost, networkCreationDescriptor.Name);
    } else {
      plugins.smartlog.defaultLogger.log('error', 'There has been an error creating the wanted network');
      return null
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

  constructor(dockerHostArg: DockerHost, dockerNetworkObjectArg: any) {
    this.dockerHost = dockerHostArg;
    Object.keys(dockerNetworkObjectArg).forEach(keyArg => {
      this[keyArg] = dockerNetworkObjectArg[keyArg];
    });
  }

  /**
   * removes the network
   */
  public async remove() {
    const response = await this.dockerHost.request('DELETE', `/networks/${this.Id}`);
  }
}
