import * as plugins from './dockersock.plugins';
import { DockerHost } from './docker.classes.host';

export class DockerContainer {
  static async getContainers(dockerHostArg: DockerHost): Promise<DockerContainer[]> {
    const result = [];
    await dockerHostArg.request('GET', '/containers/json')
    return result;
  }
}
