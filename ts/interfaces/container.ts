import { DockerNetwork } from '../docker.classes.network';

export interface IContainerCreationDescriptor {
  hostname: string;
  domainName: string;
  networks?: DockerNetwork[];
}
