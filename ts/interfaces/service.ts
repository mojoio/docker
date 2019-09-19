import * as interfaces from './';
import { DockerNetwork } from '../docker.classes.network';
import { DockerSecret } from '../docker.classes.secret';
import { DockerImage } from '../docker.classes.image';

export interface IServiceCreationDescriptor {
  name: string;
  image: DockerImage;
  labels: interfaces.TLabels;
  networks: DockerNetwork[];
  networkAlias: string;
  secrets: DockerSecret[];
  ports: string[];
  accessHostDockerSock?: boolean;
  resources?: {
    memorySizeMB: number
  };
}
