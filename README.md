# dockersock
easy communication with docker from node, TypeScript ready

## Status
[![build status](https://gitlab.com/pushrocks/dockersock/badges/master/build.svg)](https://gitlab.com/pushrocks/dockersock/commits/master)

## Usage
We recommend the use of TypeScript for best Intellisense.

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