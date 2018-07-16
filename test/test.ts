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

/*
tap.test('should pull an image from imagetag', async () => {
  await testDockerHost.pullImage('hosttoday/ht-docker-node:npmci');
});

tap.skip.test('should return a change Objservable', async () => {
  let myObservable = testDockerHost.getChangeObservable();
  testDockerHost.endRequests();
  let testPromise = observableToPromise(myObservable);
  return await expect(testPromise).to.eventually.be.fulfilled;
}); */

tap.start();
