import { expect, tap } from '@pushrocks/tapbundle';
import { DockerHost } from '../ts/index';

let testDockerHost: DockerHost;

tap.test('should create a new Dockersock instance', async () => {
  testDockerHost = new DockerHost();
  return expect(testDockerHost).to.be.instanceof(DockerHost);
});

tap.test('should list containers', async () => {
  const containers = await testDockerHost.getContainers();
  console.log(containers);
});

tap.skip.test('should pull an image from imagetag', async () => {
  // await testDockerHost.pullImage('hosttoday/ht-docker-node:npmci');
});

tap.test('should return a change Objservable', async tools => {
  const testObservable = await testDockerHost.getEventObservable();
  const subscription = testObservable.subscribe(changeObject => {
    console.log(changeObject);
  });
  await tools.delayFor(2000);
  subscription.unsubscribe();
});

tap.start();
