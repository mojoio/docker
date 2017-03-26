import "typings-global";
import { Dockersock } from "../dist/index";
import { expect, tap } from 'tapbundle'

tap.test("dockersock", function () {
    tap.test(function () {
        let testDockersock: Dockersock;
        tap.ok(function () {
            testDockersock = new Dockersock();
            testDockersock.should.be.instanceof(Dockersock);
        }, "should create a new Dockersock instance");
        tap.ok("should list containers", function (done) {
            testDockersock.listContainers()
                .then((dataArg) => {
                    console.log(dataArg);
                    done();
                });
        });
        tap.ok(function (done) {
            testDockersock.listContainersDetailed()
                .then((dataArg) => {
                    console.log(dataArg);
                    done();
                });
        }, "should list detailed containers");
        tap.ok(function () {
            return testDockersock.pullImage("hosttoday/ht-docker-dbase")
        }, "should pull an image from imagetag");
        tap.ok(function (done) {
            testDockersock.getChangeObservable();
            testDockersock.endRequests();
            done();
        }, "should return a change Objservable")
    });
});