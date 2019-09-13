import * as plugins from './docker.plugins';
import { DockerHost } from './docker.classes.host';

// interfaces
import * as interfaces from './interfaces';

export class DockerSecret {
  // STATIC
  public static async getSecrets(dockerHostArg: DockerHost) {
    const response = await dockerHostArg.request('GET', '/secrets');
    const secrets: DockerSecret[] = [];
    for (const secret of response.body) {
      const dockerSecretInstance = new DockerSecret(dockerHostArg);
      Object.assign(dockerSecretInstance, secret);
      secrets.push(dockerSecretInstance);
    }
    return secrets;
  }

  public static async getSecretByID (dockerHostArg: DockerHost, idArg: string) {
    const secrets = await this.getSecrets(dockerHostArg);
    return secrets.find(secret => secret.ID === idArg);
  }

  public static async getSecretByName (dockerHostArg: DockerHost, nameArg: string) {
    const secrets = await this.getSecrets(dockerHostArg);
    return secrets.find(secret => secret.Spec.Name === nameArg);
  }

  public static async createSecret(dockerHostArg: DockerHost, secretDescriptor: interfaces.ISecretCreationDescriptor) {
    const labels: interfaces.TLabels = {
      ...secretDescriptor.labels,
      version: secretDescriptor.version
    };
    const response = await dockerHostArg.request('POST', '/secrets/create', {
      Name: secretDescriptor.name,
      Labels: labels,
      Data: plugins.smartstring.base64.encode(secretDescriptor.contentArg)
    });
    
    const newSecretInstance = new DockerSecret(dockerHostArg);
    Object.assign(newSecretInstance, response.body);
    Object.assign (newSecretInstance, await DockerSecret.getSecretByID(dockerHostArg, newSecretInstance.ID));
    return newSecretInstance;
  }

  // INSTANCE
  public ID: string;
  public Spec: {
    Name: string;
    Labels: interfaces.TLabels;
  };
  public Version: {
    Index:string;
  };

  public dockerHost: DockerHost;
  constructor(dockerHostArg: DockerHost) {
    this.dockerHost = dockerHostArg;
  }

  /**
   * updates a secret
   */
  public async update (contentArg: string) {
    const route = `/secrets/${this.ID}/update?=version=${this.Version.Index}`;
    const response = await this.dockerHost.request('POST', `/secrets/${this.ID}/update?version=${this.Version.Index}`, {
      Name: this.Spec.Name,
      Labels: this.Spec.Labels,
      Data: plugins.smartstring.base64.encode(contentArg)
    });
  }

  public async remove () {
    await this.dockerHost.request('DELETE', `/secrets/${this.ID}`);
  }


  // get things
  public getVersion() {
    return this.Spec.Labels.version;
  }
}