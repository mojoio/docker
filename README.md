# @mojoio/dockersock

easy communication with docker remote api from node, TypeScript ready

## Availabililty

[![npm](https://mojoio.gitlab.io/assets/repo-button-npm.svg)](https://www.npmjs.com/package/dockersock)
[![git](https://mojoio.gitlab.io/assets/repo-button-git.svg)](https://GitLab.com/mojoio/dockersock)
[![git](https://mojoio.gitlab.io/assets/repo-button-mirror.svg)](https://github.com/mojoio/dockersock)
[![docs](https://mojoio.gitlab.io/assets/repo-button-docs.svg)](https://mojoio.gitlab.io/dockersock/)

## Status for master

[![build status](https://GitLab.com/mojoio/dockersock/badges/master/build.svg)](https://GitLab.com/mojoio/dockersock/commits/master)
[![coverage report](https://GitLab.com/mojoio/dockersock/badges/master/coverage.svg)](https://GitLab.com/mojoio/dockersock/commits/master)
[![npm downloads per month](https://img.shields.io/npm/dm/dockersock.svg)](https://www.npmjs.com/package/dockersock)
[![Dependency Status](https://david-dm.org/mojoio/dockersock.svg)](https://david-dm.org/mojoio/dockersock)
[![bitHound Dependencies](https://www.bithound.io/github/mojoio/dockersock/badges/dependencies.svg)](https://www.bithound.io/github/mojoio/dockersock/master/dependencies/npm)
[![bitHound Code](https://www.bithound.io/github/mojoio/dockersock/badges/code.svg)](https://www.bithound.io/github/mojoio/dockersock)
[![TypeScript](https://img.shields.io/badge/TypeScript-2.x-blue.svg)](https://nodejs.org/dist/latest-v6.x/docs/api/)
[![node](https://img.shields.io/badge/node->=%206.x.x-blue.svg)](https://nodejs.org/dist/latest-v6.x/docs/api/)
[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Usage

Use TypeScript for best in class instellisense.

```TypeScript
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

For further information read the linked docs at the top of this README.

> MIT licensed | **&copy;** [Lossless GmbH](https://lossless.gmbh)
> | By using this npm module you agree to our [privacy policy](https://lossless.gmbH/privacy.html)

[![repo-footer](https://mojoio.gitlab.io/assets/repo-footer.svg)](https://mojo.io)
