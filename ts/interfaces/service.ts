import * as interfaces from './';
import { DockerNetwork } from '../docker.classes.network';
import { DockerSecret } from '../docker.classes.secret';

export interface IServiceCreationDescriptor {
  Name: string;
  Image: string;
  Labels: interfaces.TLabels;
  networks: DockerNetwork[];
  networkAlias: string;
  secrets: DockerSecret[];
}
