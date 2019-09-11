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

    const serviceVersion = serviceImage.Labels.version;
    serviceCreationDescriptor.Labels.version = serviceVersion;

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
        },
        ForceUpdate: 1
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
    Labels: interfaces.TLabels; // ZBD
    TaskTemplate: {
      ContainerSpec: {
        Image: string;
        Isolation: string;
      }
      ForceUpdate: 0;
    },
    Mode: {};
    Networks: [any[]]
  };
  public Endpoint: { Spec: {}, VirtualIPs: [any[]] };


  constructor(dockerHostArg: DockerHost) {
    this.dockerHostRef = dockerHostArg;
  }

  public async update() {
    const labels: interfaces.TLabels = {
      ...this.Spec.Labels,

    };
    const dockerData = await this.dockerHostRef.request('POST', `/servces/${this.ID}/update?version=${this.Version.Index}`, {
      Name: this.Spec.Name,
      TaskTemplate: {
        ContainerSpec: {
          Image: this.Spec.TaskTemplate.ContainerSpec.Image,
          Labels: labels
        },
        ForceUpdate: 1
      },
      Labels: labels,
    });
    Object.assign(this, dockerData);
  }

  public async remove() {
    await this.dockerHostRef.request('DELETE', `/services/${this.ID}`);
  }

  public async reReadFromDockerEngine () {
    const dockerData = await this.dockerHostRef.request('GET', `/services/${this.ID}`);
    Object.assign(this, dockerData);
  }

  public async updateFromRegistry () {
    // TODO: implement digest based update recognition

    await this.reReadFromDockerEngine();
    const dockerImage = await DockerImage.createFromRegistry(this.dockerHostRef, {
      imageUrl: this.Spec.TaskTemplate.ContainerSpec.Image 
    });

    const imageVersion = new plugins.smartversion.SmartVersion(dockerImage.Labels.version);
    const serviceVersion = new plugins.smartversion.SmartVersion(this.Spec.Labels.version);
    if (imageVersion.greaterThan(serviceVersion)) {
      console.log('service needs to be updated');
      this.update();
    }



  }
}
