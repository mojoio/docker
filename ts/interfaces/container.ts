import { DockerNetwork } from '../docker.classes.network';

export interface IContainerCreationSpecifier {
  hostname: string;
  domainName: string;
  networks?: DockerNetwork[];
}
