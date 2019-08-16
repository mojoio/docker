import * as plugins from './docker.plugins';
import * as interfaces from './interfaces';

import { DockerHost } from './docker.classes.host';

export class DockerService {
  // STATIC
  public static async getServices(dockerHost: DockerHost) {
    const services: DockerService[] = [];
    const response = await dockerHost.request('GET', '/services');
    for (const serviceObject of response.body) {
      services.push(new DockerService(dockerHost, serviceObject));
    }
    return services;
  }

  /**
   * creates a service
   */
  public static async createService(
    dockerHost: DockerHost,
    serviceCreationDescriptor: interfaces.IServiceCreationDescriptor
  ) {
    dockerHost.request('POST', '/services/create', {
      Name: serviceCreationDescriptor.Name,
      TaskTemplate: {
        ContainerSpec: {
          Image: serviceCreationDescriptor.Image,
          Labels: serviceCreationDescriptor.Labels
        }
      },
      Labels: serviceCreationDescriptor.Labels
    });
  }

  // INSTANCE
  public dockerHost: DockerHost;

  constructor(dockerHostArg: DockerHost, serviceObject) {
    this.dockerHost = dockerHostArg;
    Object.assign(this, serviceObject);
  }
}
