import * as interfaces from './';
import { DockerNetwork } from '../docker.classes.network';
import { DockerSecret } from '../docker.classes.secret';

export interface IServiceCreationDescriptor {
  name: string;
  image: string;
  labels: interfaces.TLabels;
  networks: DockerNetwork[];
  networkAlias: string;
  secrets: DockerSecret[];
}
