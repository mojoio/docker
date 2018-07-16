import * as plugins from "./dockersock.plugins";
import { DockerContainer } from "./docker.classes.container";

export class DockerHost {
  /**
   * the path where the docker sock can be found
   */
  sockPath: string;

  /**
   * keeping track of currently active requests to safely end this module at any time
   */
  requestObjectmap = new plugins.lik.Objectmap<any>();

  /**
   * the constructor to instantiate a new docker sock instance
   * @param pathArg
   */
  constructor(pathArg: string = "http://unix:/var/run/docker.sock:") {
    this.sockPath = pathArg;
  }

  /**
   * authenticate against a registry
   * @param userArg
   * @param passArg
   */
  auth(registryArg: string, userArg: string, passArg: string) {
    let done = plugins.smartpromise.defer();
    this.request("POST", "");
    return done.promise;
  }

  /**
   *
   */
  async getContainers() {
    const containerArray = await DockerContainer.getContainers(this);
    return containerArray;
  }

  /**
   * fire a request
   */
  async request(methodArg: string, routeArg: string, dataArg = {}) {
    const requestUrl = `${this.sockPath}${routeArg}`
    console.log(requestUrl);
    const response = await plugins.smartrequest.request(requestUrl, {
      method: methodArg,
      headers: {
        "Content-Type": "application/json",
        "Host": "docker.sock"
      },
      requestBody: dataArg
    });
    return response
  }
}
