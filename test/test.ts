import "typings-global";
import { expect, tap } from 'tapbundle'
import * as observableToPromise from 'observable-to-promise'
import { Dockersock } from "../dist/index";

let testDockersock: Dockersock;

tap.test("should create a new Dockersock instance", async () => {
    testDockersock = new Dockersock();
    return expect(testDockersock).to.be.instanceof(Dockersock);
}).catch(tap.threw);

tap.test("should list containers", async () => {
    await testDockersock.listContainers()
        .then(async (dataArg) => {
            console.log(dataArg);
        });
}).catch(tap.threw);

tap.test("should list detailed containers", async () => {
    await testDockersock.listContainersDetailed()
        .then(async (dataArg) => {
            console.log(dataArg);
        });
}).catch(tap.threw);

tap.test("should pull an image from imagetag", async () => {
    await testDockersock.pullImage("hosttoday/ht-docker-node:npmci")
}).catch(tap.threw);

/*tap.test("should return a change Objservable", async () => {
    let myObservable = testDockersock.getChangeObservable();
    testDockersock.endRequests();
    let testPromise = observableToPromise(myObservable)
    return await expect(testPromise).to.eventually.be.fulfilled
}).catch(tap.threw);*/