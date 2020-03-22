import * as plugins from './docker.plugins';
import * as interfaces from './interfaces';

import { DockerHost } from './docker.classes.host';
import { DockerImage } from './docker.classes.image';
import { DockerSecret } from './docker.classes.secret';

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

  public static async getServiceByName(
    dockerHost: DockerHost,
    networkName: string
  ): Promise<DockerService> {
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
    plugins.smartlog.defaultLogger.log(
      'info',
      `now creating service ${serviceCreationDescriptor.name}`
    );

    // await serviceCreationDescriptor.image.pullLatestImageFromRegistry();
    const serviceVersion = await serviceCreationDescriptor.image.getVersion();

    const labels: interfaces.TLabels = {
      ...serviceCreationDescriptor.labels,
      version: serviceVersion
    };

    const mounts: Array<{
      /**
       * the target inside the container
       */
      Target: string;
      /**
       * The Source from which to mount the data (Volume or host path)
       */
      Source: string;
      Type: 'bind' | 'volume' | 'tmpfs' | 'npipe';
      ReadOnly: boolean;
      Consistency: 'default' | 'consistent' | 'cached' | 'delegated';
    }> = [];
    if (serviceCreationDescriptor.accessHostDockerSock) {
      mounts.push({
        Target: '/var/run/docker.sock',
        Source: '/var/run/docker.sock',
        Consistency: 'default',
        ReadOnly: false,
        Type: 'bind'
      });
    }

    if (serviceCreationDescriptor.resources && serviceCreationDescriptor.resources.volumeMounts) {
      for(const volumeMount of serviceCreationDescriptor.resources.volumeMounts) {
        mounts.push({
          Target: volumeMount.containerFsPath,
          Source: volumeMount.hostFsPath,
          Consistency: 'default',
          ReadOnly: false,
          Type: 'bind'
        });
      }
    }

    const networkArray: Array<{
      Target: string;
      Aliases: string[];
    }> = [];

    for (const network of serviceCreationDescriptor.networks) {
      networkArray.push({
        Target: network.Name,
        Aliases: [serviceCreationDescriptor.networkAlias]
      });
    }

    const ports = [];
    for (const port of serviceCreationDescriptor.ports) {
      const portArray = port.split(':');
      const hostPort = portArray[0];
      const containerPort = portArray[1];
      ports.push({
        Protocol: 'tcp',
        PublishedPort: parseInt(hostPort, 10),
        TargetPort: parseInt(containerPort, 10)
      });
    }

    // lets configure secrets
    const secretArray: any[] = [];
    for (const secret of serviceCreationDescriptor.secrets) {
      secretArray.push({
        File: {
          Name: 'secret.json', // TODO: make sure that works with multiple secrets
          UID: '33',
          GID: '33',
          Mode: 384
        },
        SecretID: secret.ID,
        SecretName: secret.Spec.Name
      });
    }

    // lets configure limits

    const memoryLimitMB =
      serviceCreationDescriptor.resources && serviceCreationDescriptor.resources.memorySizeMB
        ? serviceCreationDescriptor.resources.memorySizeMB
        : 1000;

    const limits = {
      MemoryBytes: memoryLimitMB * 1000000
    };

    if (serviceCreationDescriptor.resources) {
      limits.MemoryBytes = serviceCreationDescriptor.resources.memorySizeMB * 1000000;
    }

    const response = await dockerHost.request('POST', '/services/create', {
      Name: serviceCreationDescriptor.name,
      TaskTemplate: {
        ContainerSpec: {
          Image: serviceCreationDescriptor.image.RepoTags[0],
          Labels: labels,
          Secrets: secretArray,
          Mounts: mounts
          /* DNSConfig: {
            Nameservers: ['1.1.1.1']
          } */
        },
        UpdateConfig: {
          Parallelism: 0,
          Delay: 0,
          FailureAction: 'pause',
          Monitor: 15000000000,
          MaxFailureRatio: 0.15
        },
        ForceUpdate: 1,
        Resources: {
          Limits: limits
        },
        LogDriver: {
          Name: 'json-file',
          Options: {
            'max-file': '3',
            'max-size': '10M'
          }
        }
      },
      Labels: labels,
      Networks: networkArray,
      EndpointSpec: {
        Ports: ports
      }
    });

    const createdService = await DockerService.getServiceByName(
      dockerHost,
      serviceCreationDescriptor.name
    );
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
    Labels: interfaces.TLabels;
    TaskTemplate: {
      ContainerSpec: {
        Image: string;
        Isolation: string;
        Secrets: Array<{
          File: {
            Name: string;
            UID: string;
            GID: string;
            Mode: number;
          };
          SecretID: string;
          SecretName: string;
        }>;
      };
      ForceUpdate: 0;
    };
    Mode: {};
    Networks: [any[]];
  };
  public Endpoint: { Spec: {}; VirtualIPs: [any[]] };

  constructor(dockerHostArg: DockerHost) {
    this.dockerHostRef = dockerHostArg;
  }

  public async remove() {
    await this.dockerHostRef.request('DELETE', `/services/${this.ID}`);
  }

  public async reReadFromDockerEngine() {
    const dockerData = await this.dockerHostRef.request('GET', `/services/${this.ID}`);
    // TODO: Better assign: Object.assign(this, dockerData);
  }

  public async needsUpdate(): Promise<boolean> {
    // TODO: implement digest based update recognition

    await this.reReadFromDockerEngine();
    const dockerImage = await DockerImage.createFromRegistry(this.dockerHostRef, {
      imageUrl: this.Spec.TaskTemplate.ContainerSpec.Image
    });

    const imageVersion = new plugins.smartversion.SmartVersion(dockerImage.Labels.version);
    const serviceVersion = new plugins.smartversion.SmartVersion(this.Spec.Labels.version);
    if (imageVersion.greaterThan(serviceVersion)) {
      console.log(`service ${this.Spec.Name}  needs to be updated`);
      return true;
    } else {
      console.log(`service ${this.Spec.Name} is up to date.`);
    }
  }
}
