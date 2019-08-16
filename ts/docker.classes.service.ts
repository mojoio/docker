import * as plugins from './docker.plugins';
import * as interfaces from './interfaces';

import { DockerHost } from './docker.classes.host';
import { DockerImage } from './docker.classes.image';

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
    // lets get the image
    plugins.smartlog.defaultLogger.log('info', `downloading image for service ${serviceCreationDescriptor.Name}`);
    const serviceImage = await DockerImage.createFromRegistry(dockerHost, {
      imageUrl: serviceCreationDescriptor.Image
    });

    const networkArray: any[] = [];
    for (const network of serviceCreationDescriptor.networks) {
      networkArray.push({
        Target: network.Name,
        Aliases: [serviceCreationDescriptor.networkAlias]
      });
    }

    dockerHost.request('POST', '/services/create', {
      Name: serviceCreationDescriptor.Name,
      TaskTemplate: {
        ContainerSpec: {
          Image: serviceCreationDescriptor.Image,
          Labels: serviceCreationDescriptor.Labels
        }
      },
      Labels: serviceCreationDescriptor.Labels,
      Networks: networkArray
    });
  }

  // INSTANCE
  public dockerHost: DockerHost;

  constructor(dockerHostArg: DockerHost, serviceObject) {
    this.dockerHost = dockerHostArg;
    Object.assign(this, serviceObject);
  }
}
