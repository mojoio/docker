import { expect, tap } from '@pushrocks/tapbundle';
import * as docker from '../ts/index';

let testDockerHost: docker.DockerHost;

tap.test('should create a new Dockersock instance', async () => {
  testDockerHost = new docker.DockerHost('http://unix:/var/run/docker.sock:');
  return expect(testDockerHost).to.be.instanceof(docker.DockerHost);
});

tap.test('should create a docker swarm', async () => {
  await testDockerHost.activateSwarm();
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
    imageTag: 'alpine'
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

// SECRETS
tap.test('should create a secret', async () => {
  const mySecret = await docker.DockerSecret.createSecret(testDockerHost, {
    name: 'testSecret',
    version: '1.0.3',
    contentArg: `{ "hi": "wow"}`,
    labels: {}
  });
  console.log(mySecret);
});

tap.test('should remove a secret by name', async () => {
  const mySecret = await docker.DockerSecret.getSecretByName(testDockerHost, 'testSecret');
  await mySecret.remove();
});

// SERVICES
tap.test('should activate swarm mode', async () => {
  await testDockerHost.activateSwarm();
});

tap.test('should list all services', async tools => {
  const services = await testDockerHost.getServices();
  console.log(services);
});

tap.test('should create a service', async () => {
  const testNetwork = await docker.DockerNetwork.createNetwork(testDockerHost, {
    Name: 'testNetwork'
  });
  const testSecret = await docker.DockerSecret.createSecret(testDockerHost, {
    name: 'serviceSecret',
    version: '0.0.1',
    labels: {},
    contentArg: '{"hi": "wow"}'
  });
  const testImage = await docker.DockerImage.createFromRegistry(testDockerHost, {
    imageUrl: 'nginx:latest'
  });
  const testService = await docker.DockerService.createService(testDockerHost, {
    image: testImage,
    labels: {
      testlabel: 'hi'
    },
    name: 'testService',
    networks: [testNetwork],
    networkAlias: 'testService',
    secrets: [testSecret],
    ports: []
  });

  await testService.remove();
  await testNetwork.remove();
  await testSecret.remove();
});

tap.start();
