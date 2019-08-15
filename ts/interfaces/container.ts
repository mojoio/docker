import { DockerNetwork } from '../docker.classes.network';

export interface IContainerCreationDescriptor {
  Hostname: string;
  Domainname: string;
  networks?: DockerNetwork[];
}
