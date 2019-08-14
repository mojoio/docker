import * as plugins from './dockersock.plugins';
import * as interfaces from './interfaces';

import { DockerHost } from './docker.classes.host';

export class DockerNetwork {
  public static async getNetworks(dockerHost: DockerHost): Promise<DockerNetwork[]> {
    const dockerNetworks: DockerNetwork[] = [];
    return dockerNetworks;
  }

  public static async createNetwork(dockerHost: DockerHost, networkCreationDescriptor) {
    // TODO: implement create network
  }

  constructor(dockerNetworkObjectArg: any) {
    Object.keys(dockerNetworkObjectArg).forEach(keyArg => {
      this[keyArg] = dockerNetworkObjectArg[keyArg];
    });
  }

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
    Driver: "default" | "bridge" | "overlay",
    Config: [
      {
        Subnet: string,
        IPRange: string,
        Gateway: string
      }
    ]
  };


}
