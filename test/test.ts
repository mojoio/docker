import "typings-global";
import { expect, tap } from 'tapbundle'
import * as observableToPromise from 'observable-to-promise'
import { Dockersock } from "../dist/index";

let testDockersock: Dockersock;

tap.test("should create a new Dockersock instance", async () => {
    testDockersock = new Dockersock();
    return expect(testDockersock).to.be.instanceof(Dockersock);
})

tap.test("should list containers", async () => {
    let data = await testDockersock.listContainers()
    console.log(data)
})

tap.test("should list detailed containers", async () => {
    let data = await testDockersock.listContainersDetailed()
    console.log(data)
})

tap.test("should pull an image from imagetag", async () => {
    await testDockersock.pullImage("hosttoday/ht-docker-node:npmci")
})

tap.test("should return a change Objservable", async () => {
    let myObservable = testDockersock.getChangeObservable();
    testDockersock.endRequests();
    let testPromise = observableToPromise(myObservable)
    return await expect(testPromise).to.eventually.be.fulfilled
})

tap.start()
