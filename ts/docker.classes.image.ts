import * as plugins from './dockersock.plugins';
import { DockerHost } from './docker.classes.host';

export class DockerImage {
  /**
   * the tags for an image
   */
  tags: string[] = [];

  static async createFromRegsitry(dockerHostArg: DockerHost): Promise<DockerImage> {
    const resultingImage = new DockerImage();
    return resultingImage;
  }
}