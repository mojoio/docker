import * as plugins from './docker.plugins';
import * as interfaces from './interfaces';

import { DockerHost } from './docker.classes.host';
import { logger } from './docker.logging';

export class DockerContainer {
  // STATIC

  /**
   * get all containers
   */
  public static async getContainers(dockerHostArg: DockerHost): Promise<DockerContainer[]> {
    const result: DockerContainer[] = [];
    const response = await dockerHostArg.request('GET', '/containers/json');

    // TODO: Think about getting the config by inpsecting the container
    for (const containerResult of response.body) {
      result.push(new DockerContainer(dockerHostArg, containerResult));
    }
    return result;
  }

  /**
   * gets an container by Id
   * @param containerId
   */
  public static async getContainerById(containerId: string) {
    // TODO: implement get container by id
  }

  /**
   * create a container
   */
  public static async create(
    dockerHost: DockerHost,
    containerCreationDescriptor: interfaces.IContainerCreationDescriptor
  ) {
    // check for unique hostname
    const existingContainers = await DockerContainer.getContainers(dockerHost);
    const sameHostNameContainer = existingContainers.find(container => {
      // TODO implement HostName Detection;
      return false;
    });
    const response = await dockerHost.request('POST', '/containers/create', {
      Hostname: containerCreationDescriptor.Hostname,
      Domainname: containerCreationDescriptor.Domainname,
      User: 'root'
    });
    if (response.statusCode < 300) {
      logger.log('info', 'Container created successfully');
    } else {
      logger.log(
        'error',
        'There has been a problem when creating the container'
      );
    }
  }

  // INSTANCE
  // references
  public dockerHost: DockerHost;

  // properties
  public Id: string;
  public Names: string[];
  public Image: string;
  public ImageID: string;
  public Command: string;
  public Created: number;
  public Ports: interfaces.TPorts;
  public Labels: interfaces.TLabels;
  public State: string;
  public Status: string;
  public HostConfig: any;
  public NetworkSettings: {
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
  public Mounts: any;
  constructor(dockerHostArg: DockerHost, dockerContainerObjectArg: any) {
    this.dockerHost = dockerHostArg;
    Object.keys(dockerContainerObjectArg).forEach(keyArg => {
      this[keyArg] = dockerContainerObjectArg[keyArg];
    });
  }
}
