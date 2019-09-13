import * as docker from '../ts';
import * as smartstring from '@pushrocks/smartstring';

const run  = async () => {
  const dockerHost = new docker.DockerHost();
  await docker.DockerImage.createFromRegistry(dockerHost, {
    imageUrl: 'registry.gitlab.com/servezone/private/cloudly:latest'
  });
};

run();