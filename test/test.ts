import { expect, tap } from '@pushrocks/tapbundle';
import * as docker from '../ts/index';

let testDockerHost: docker.DockerHost;

tap.test('should create a new Dockersock instance', async () => {
  testDockerHost = new docker.DockerHost();
  return expect(testDockerHost).to.be.instanceof(docker.DockerHost);
});

// Containers
tap.test('should list containers', async () => {
  const containers = await testDockerHost.getContainers();
  console.log(containers);
});

// Networks
tap.test('should list networks', async () => {
  const networks = await testDockerHost.getNetworks();
  console.log(networks);
});

tap.test('should create a network', async () => {
  const newNetwork = await docker.DockerNetwork.createNetwork(testDockerHost, {
    Name: 'webgateway'
  });
  expect(newNetwork).to.be.instanceOf(docker.DockerNetwork);
  expect(newNetwork.Name).to.equal('webgateway');
});

tap.test('should remove a network', async () => {
  const webgateway = await docker.DockerNetwork.getNetworkByName(testDockerHost, 'webgateway');
  await webgateway.remove();
});

// Images
tap.test('should pull an image from imagetag', async () => {
  const image = await docker.DockerImage.createFromRegistry(testDockerHost, {
    imageUrl: 'hosttoday/ht-docker-node',
    tag: 'alpine'
  });
  expect(image).to.be.instanceOf(docker.DockerImage);
  console.log(image);
});

tap.test('should return a change Observable', async tools => {
  const testObservable = await testDockerHost.getEventObservable();
  const subscription = testObservable.subscribe(changeObject => {
    console.log(changeObject);
  });
  await tools.delayFor(2000);
  subscription.unsubscribe();
});

// SERVICES
tap.test('should activate swarm mode', async () => {
  await testDockerHost.activateSwarm();
});

tap.test('should list all services', async tools => {
  const services = await docker.DockerService.getServices(testDockerHost);
  console.log(services);
});

tap.start();
