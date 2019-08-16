import * as interfaces from './';
import { DockerNetwork } from '../docker.classes.network';

export interface IServiceCreationDescriptor {
  Name: string;
  Image: string;
  Labels: interfaces.TLabels;
  networks: DockerNetwork[];
}
