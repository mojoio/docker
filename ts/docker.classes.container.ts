import * as plugins from './dockersock.plugins';
import { DockerHost } from './docker.classes.host';

export class DockerContainer {
  static async getContainers(dockerHostArg: DockerHost): Promise<DockerContainer[]> {
    const result: DockerContainer[] = [];
    const response = await dockerHostArg.request('GET', '/containers/json');
    for(const containerResult in response.body) {
      result.push(new DockerContainer());
    }
    return result;
  }
}
