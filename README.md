# @mojoio/docker
unofficial docker engine api abstraction package written in TypeScript

## Availabililty and Links
* [npmjs.org (npm package)](https://www.npmjs.com/package/@mojoio/docker)
* [gitlab.com (source)](https://gitlab.com/mojoio/docker)
* [github.com (source mirror)](https://github.com/mojoio/docker)
* [docs (typedoc)](https://mojoio.gitlab.io/docker/)

## Status for master
[![build status](https://gitlab.com/mojoio/docker/badges/master/build.svg)](https://gitlab.com/mojoio/docker/commits/master)
[![coverage report](https://gitlab.com/mojoio/docker/badges/master/coverage.svg)](https://gitlab.com/mojoio/docker/commits/master)
[![npm downloads per month](https://img.shields.io/npm/dm/@mojoio/docker.svg)](https://www.npmjs.com/package/@mojoio/docker)
[![Known Vulnerabilities](https://snyk.io/test/npm/@mojoio/docker/badge.svg)](https://snyk.io/test/npm/@mojoio/docker)
[![TypeScript](https://img.shields.io/badge/TypeScript->=%203.x-blue.svg)](https://nodejs.org/dist/latest-v10.x/docs/api/)
[![node](https://img.shields.io/badge/node->=%2010.x.x-blue.svg)](https://nodejs.org/dist/latest-v10.x/docs/api/)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)](https://prettier.io/)

## Usage

Use TypeScript for best in class instellisense.

```typescript
import {Dockersock} from "dockersock"; // require Dockersock class

let myDockersock = new Dockersock(); // optional: you can pass a domain to the contructor, defaults to  /var/run/docker.sock

myDockersock.listContainers() // promise, resolve gets container data
myDockersock.listContainersDetailed() // promise, resolve gets more detailed container data (by combining several requests internally)
myDockersock.listContainersRunning() // promise, resolve gets container data for currently running containers
myDockersock.listContainersStopped() // promise, resolve gets container data for stopped containers

myDockersock.startContainer({ // starts a already present container
    name: "somecontainername"
})

myDockersock.newContainer({ // start new Container, equals "docker run" shell command
    image: "someimagetag"
})
```

For further information read the linked docs at the top of this readme.

> MIT licensed | **&copy;** [Lossless GmbH](https://lossless.gmbh)
| By using this npm module you agree to our [privacy policy](https://lossless.gmbH/privacy)

[![repo-footer](https://lossless.gitlab.io/publicrelations/repofooter.svg)](https://maintainedby.lossless.com)
