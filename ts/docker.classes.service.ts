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
      const dockerService = new DockerService(dockerHost);
      Object.assign(dockerService, serviceObject);
      services.push(dockerService);
    }
    return services;
  }

  public static async getServiceByName(dockerHost: DockerHost, networkName: string): Promise<DockerService> {
    const allServices = await DockerService.getServices(dockerHost);
    const wantedService = allServices.find(service => {
      return service.Spec.Name === networkName;
    });
    return wantedService;
  }

  /**
   * creates a service
   */
  public static async createService(
    dockerHost: DockerHost,
    serviceCreationDescriptor: interfaces.IServiceCreationDescriptor
  ): Promise<DockerService> {
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

    const response = await dockerHost.request('POST', '/services/create', {
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

    const createdService = await DockerService.getServiceByName(dockerHost, serviceCreationDescriptor.Name);
    return createdService;
  }

  // INSTANCE
  public dockerHostRef: DockerHost;
  
  public ID: string;
  public Version: { Index: number };
  public CreatedAt: string;
  public UpdatedAt: string;
  public Spec: {
    Name: string;
    Labels: [any]; // ZBD
    TaskTemplate: [any],
    Mode: [any];
    Networks: [any[]]
  };
  public Endpoint: { Spec: {}, VirtualIPs: [any[]] };


  constructor(dockerHostArg: DockerHost) {
    this.dockerHostRef = dockerHostArg;
  }

  public async update() {
    
  }

  public async remove() {
    await this.dockerHostRef.request('DELETE', `/services/${this.ID}`);
  }
}
