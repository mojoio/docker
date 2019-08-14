import * as plugins from './dockersock.plugins';
import * as interfaces from './interfaces';

import { DockerHost } from './docker.classes.host';

export class DockerContainer {
  // ======
  // STATIC
  // ======

  /**
   * get all containers
   */
  public static async getContainers(dockerHostArg: DockerHost): Promise<DockerContainer[]> {
    const result: DockerContainer[] = [];
    const response = await dockerHostArg.request('GET', '/containers/json');

    // TODO: Think about getting the config by inpsecting the container
    for (const containerResult of response.body) {
      result.push(new DockerContainer(containerResult));
    }
    return result;
  }

  /**
   * gets an container by Id
   * @param containerId
   */
  public static async getContainerById(containerId: string) {}

  /**
   * create a container
   */
  public static async create(creationSpecifier: interfaces.IContainerCreationSpecifier) {}

  // ========
  // INSTANCE
  // ========

  constructor(dockerContainerObjectArg: any) {
    Object.keys(dockerContainerObjectArg).forEach(keyArg => {
      this[keyArg] = dockerContainerObjectArg[keyArg];
    });
  }

  Id: string;
  Names: string[];
  Image: string;
  ImageID: string;
  Command: string;
  Created: number;
  Ports: interfaces.TPorts;
  Labels: interfaces.TLabels;
  State: string;
  Status: string;
  HostConfig: any;
  NetworkSettings: {
    Networks: {
      [key: string]: {
        IPAMConfig: any;
        Links: any;
        Aliases: any;
        NetworkID: string;
        EndpointID: string;
        Gateway: string;
        IPAddress: string;
        IPPrefixLen: number;
        IPv6Gateway: string;
        GlobalIPv6Address: string;
        GlobalIPv6PrefixLen: number;
        MacAddress: string;
        DriverOpts: any;
      };
    };
  };
  Mounts: any;
}
