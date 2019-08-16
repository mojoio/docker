import * as plugins from './docker.plugins';
import * as interfaces from './interfaces';
import { DockerHost } from './docker.classes.host';

export class DockerImage {
  // STATIC
  public static async getImages(dockerHost: DockerHost) {
    const images: DockerImage[] = [];
    const response = await dockerHost.request('GET', '/images/json');
    for (const imageObject of response.body) {
      images.push(new DockerImage(dockerHost, imageObject));
    }
    return images;
  }

  public static async findImageByName(dockerHost: DockerHost, imageNameArg: string) {
    const images = await this.getImages(dockerHost);
    return images.find(image => {
      return image.RepoTags.includes(imageNameArg);
    });
  }

  public static async createFromRegistry(
    dockerHostArg: DockerHost,
    creationObject: interfaces.IImageCreationDescriptor
  ): Promise<DockerImage> {
    const response = await dockerHostArg.request(
      'POST',
      `/images/create?fromImage=${encodeURIComponent(
        creationObject.imageUrl
      )}&tag=${encodeURIComponent(creationObject.tag)}`
    );
    if (response.statusCode < 300) {
      plugins.smartlog.defaultLogger.log(
        'info',
        `Successfully pulled image ${creationObject.imageUrl} from the registry`
      );
      const originTag = `${creationObject.imageUrl}:${creationObject.tag}`;
      console.log(originTag);
      const image = await DockerImage.findImageByName(dockerHostArg, originTag);
      return image;
    } else {
      plugins.smartlog.defaultLogger.log('error', `Failed at the attempt of creating a new image`);
    }
  }

  public static async tagImageByIdOrName(
    dockerHost: DockerHost,
    idOrNameArg: string,
    newTagArg: string
  ) {
    const response = await dockerHost.request(
      'POST',
      `/images/${encodeURIComponent(idOrNameArg)}/${encodeURIComponent(newTagArg)}`
    );
  }

  public static async buildImage(dockerHostArg: DockerHost, dockerImageTag) {
    // TODO: implement building an image
  }

  // INSTANCE
  // references
  public dockerHost: DockerHost;

  // properties
  /**
   * the tags for an image
   */
  public Containers: number;
  public Created: number;
  public Id: string;
  public Labels: interfaces.TLabels;
  public ParentId: string;
  public RepoDigests: string[];
  public RepoTags: string[];
  public SharedSize: number;
  public Size: number;
  public VirtualSize: number;

  constructor(dockerHostArg, dockerImageObjectArg: any) {
    this.dockerHost = dockerHostArg;
    Object.keys(dockerImageObjectArg).forEach(keyArg => {
      this[keyArg] = dockerImageObjectArg[keyArg];
    });
  }

  /**
   * returns a boolean wether the image has a upstream image
   */
  public isUpstreamImage(): boolean {
    // TODO: implement isUpastreamImage
    return this.RepoTags.length > 0;
  }

  public tagImage(newTag) {}

  /**
   * pulls the latest version from the registry
   */
  public async pullLatestImageFromRegistry(): Promise<boolean> {
    const dockerImageUrl = this.RepoTags[0].split(':')[0];
    const dockerImageTag = this.RepoTags[0].split(':')[1];
    const updatedImage = await DockerImage.createFromRegistry(this.dockerHost, {
      imageUrl: dockerImageUrl,
      tag: dockerImageTag
    });
    Object.assign(this, updatedImage);
    // TODO: Compare image digists before and after
    return true;
  }
}
