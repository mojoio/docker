import * as plugins from './docker.plugins';
import { DockerContainer } from './docker.classes.container';
import { DockerNetwork } from './docker.classes.network';

export class DockerHost {
  /**
   * the path where the docker sock can be found
   */
  public socketPath: string;

  /**
   * the constructor to instantiate a new docker sock instance
   * @param pathArg
   */
  constructor(pathArg: string = 'http://unix:/var/run/docker.sock:') {
    this.socketPath = pathArg;
  }

  /**
   * authenticate against a registry
   * @param userArg
   * @param passArg
   */
  public async auth(registryArg: string, userArg: string, passArg: string) {
    // TODO: implement Docker Registry authentication
    await this.request('POST', '');
  }

  /**
   * gets all networks
   */
  public async getNetworks() {
    return await DockerNetwork.getNetworks(this);
  }

  /**
   * gets all containers
   */
  public async getContainers() {
    const containerArray = await DockerContainer.getContainers(this);
    return containerArray;
  }

  /**
   *
   */
  public async getEventObservable(): Promise<plugins.rxjs.Observable<any>> {
    const response = await this.requestStreaming('GET', '/events');
    return plugins.rxjs.Observable.create(observer => {
      response.on('data', data => {
        const eventString = data.toString();
        try {
          const eventObject = JSON.parse(eventString);
          observer.next(eventObject);
        } catch (e) {
          console.log(e);
        }
      });
      return () => {
        response.emit('end');
      };
    });
  }

  /**
   * activates docker swarm
   */
  public async activateSwarm(addvertisementIpArg?: string) {
    const response = await this.request('POST', '/swarm/init', {
      ListenAddr: '0.0.0.0:2377',
      AdvertiseAddr: addvertisementIpArg ? `${addvertisementIpArg}:2377`: undefined,
      DataPathPort: 4789,
      DefaultAddrPool: ['10.10.0.0/8', '20.20.0.0/8'],
      SubnetSize: 24,
      ForceNewCluster: false
    });
    if (response.statusCode === 200) {
      plugins.smartlog.defaultLogger.log('info', 'created Swam succesfully');
    } else {
      plugins.smartlog.defaultLogger.log('error', 'could not initiate swarm');
    }
  }

  /**
   * fire a request
   */
  public async request(methodArg: string, routeArg: string, dataArg = {}) {
    const requestUrl = `${this.socketPath}${routeArg}`;
    const response = await plugins.smartrequest.request(requestUrl, {
      method: methodArg,
      headers: {
        'Content-Type': 'application/json',
        Host: 'docker.sock'
      },
      requestBody: dataArg
    });
    if (response.statusCode !== 200) {
      console.log(response.body);
    }
    return response;
  }

  public async requestStreaming(methodArg: string, routeArg: string, dataArg = {}) {
    const requestUrl = `${this.socketPath}${routeArg}`;
    const response = await plugins.smartrequest.request(
      requestUrl,
      {
        method: methodArg,
        headers: {
          // 'Content-Type': 'application/json',
          Host: 'docker.sock'
        },
        requestBody: null
      },
      true
    );
    console.log(response.statusCode);
    console.log(response.body);
    return response;
  }
}
