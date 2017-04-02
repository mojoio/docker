import "typings-global";
import { expect, tap } from 'tapbundle'

import { Dockersock } from "../dist/index";

let testDockersock: Dockersock;

tap.test("should create a new Dockersock instance", async () => {
    testDockersock = new Dockersock();
    return expect(testDockersock).to.be.instanceof(Dockersock);
});

tap.test("should list containers", async () => {
    await testDockersock.listContainers()
        .then(async (dataArg) => {
            console.log(dataArg);
        });
});

tap.test("should list detailed containers", async () => {
    await testDockersock.listContainersDetailed()
        .then(async (dataArg) => {
            console.log(dataArg);
        });
});

tap.test("should pull an image from imagetag", async () => {
    await testDockersock.pullImage("hosttoday/ht-docker-dbase")
});

tap.test("should return a change Objservable", async () => {
    testDockersock.getChangeObservable();
    testDockersock.endRequests();
})