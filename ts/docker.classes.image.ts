import * as plugins from './dockersock.plugins';
import { DockerHost } from './docker.classes.host';

export class DockerImage {
  // STATIC
  public static async createFromRegistry(
    dockerHostArg: DockerHost,
    dockerImageTag
  ): Promise<DockerImage> {
    const resultingImage = new DockerImage();

    return resultingImage;
  }

  public static async createFromExistingImage(dockerHostArg: DockerHost, dockerImageTag) {}

  // INSTANCE
  /**
   * the tags for an image
   */
  public tags: string[] = [];

  /**
   * returns a boolean wether the image has a upstream image
   */
  public isUpstreamImage(): boolean {
    // TODO: implement isUpastreamImage
    return true;
  }

  /**
   *
   */
  public async pullLatestImageFromRegistry(): Promise<boolean> {
    // TODO: implement pullLatestImageFromRegistry
    return true;
  }
}
