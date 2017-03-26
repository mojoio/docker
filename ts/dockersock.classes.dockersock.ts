import "typings-global"
import * as plugins from "./dockersock.plugins";
import { Observable } from "rxjs";

// interfaces
import  { Objectmap } from 'lik'

export class Dockersock {
    sockPath: string;
    requestObjectmap = new plugins.lik.Objectmap<plugins.request.Request>();
    constructor(pathArg: string = "http://unix:/var/run/docker.sock:") {
        this.sockPath = pathArg;
    }

    // methods
    auth(userArg: string, passArg: string) {
        let done = plugins.q.defer();
        this.request("POST", "");
        return done.promise;
    }
    listContainers() {
        let done = plugins.q.defer();
        this.request("GET", "/containers")
            .then(done.resolve);
        return done.promise;
    };
    listContainersDetailed() {
        let done = plugins.q.defer();
        let detailedDataObject = [];
        this.listContainers()
            .then((dataArg) => {
                let recursiveCounter = 0;
                let makeDetailed = () => {
                    if (typeof dataArg[recursiveCounter] != "undefined") {
                        this.request("GET", "/containers/" + dataArg[recursiveCounter].Id)
                            .then((dataArg2) => {
                                detailedDataObject.push(dataArg2);
                                recursiveCounter++;
                                // recursive call
                                makeDetailed();
                            });
                    } else {
                        done.resolve(detailedDataObject);
                    }
                };
                makeDetailed();
            });
        return done.promise;
    };
    listContainersRunning() {
        let done = plugins.q.defer();
        return done.promise;
    }
    listContainersStopped() {
        let done = plugins.q.defer();
        return done.promise;
    }
    listImages() {
        return this.request("GET", "/images", "?all=true");
    }
    listImagesDangling() {
        return this.request("GET", "/images", "?dangling=true");
    }
    pullImage(imageLabelArg: string) {
        let imageLabel = encodeURI(imageLabelArg);
        return this.requestStream("POST", "/images/create?fromImage=" + imageLabel);
    };
    createContainer(optionsArg, pullFirstArg: boolean = true) {
        let done = plugins.q.defer();
        let create = () => {
            return this.request("POST", "/containers/create", "", optionsArg);
        }
        if (pullFirstArg) {
            this.pullImage(optionsArg.Image)
                .then(create)
                .then(done.resolve);
        } else {
            create()
                .then(done.resolve)
        }
        return done.promise;
    };
    getContainerId() {

    };
    startContainer(containerNameArg) {
        return this.request("POST", "/containers/" + containerNameArg + "/start");
    };
    stopContainer(containerNameArg) {
        return this.request("POST", "/containers/" + containerNameArg + "/stop");
    };
    removeContainer(containerNameArg) {
        return this.request("DELETE", "/containers/" + containerNameArg + "?v=1");
    };
    clean() {
        let done = plugins.q.defer();
        return done.promise;
    };
    callOnChange(cb: Function) {
        let cbPromise;
        let changeBuffered: boolean = false; // when cb is running then buffer any consequent change
        let requestStream = plugins.request.get(this.sockPath + "/events");
        requestStream.on("response", (response) => {
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            } else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
            }
        });
        requestStream.on("data", (data: Buffer) => {
            let status = JSON.parse(data.toString()).status;
            plugins.beautylog.logReduced(status);
            if (typeof cbPromise == "undefined" || cbPromise.state == "pending") {
                cbPromise = cb();
            } else if (changeBuffered) {
                changeBuffered = true;
                cbPromise.then(() => {
                    changeBuffered = false;
                    cbPromise = cb();
                });
            }
        });
        requestStream.on("end", () => {

        });
    };
    getChangeObservable() {
        let options = {
            method: "GET",
            url: this.sockPath + "/events",
            headers: {
                "Content-Type": "application/json",
                "Host": "docker.sock"
            }
        };
        let requestStream = plugins.request(options, (err, res, body) => {
            if (!err && res.statusCode == 200) {
            } else {
                console.log(err);
                console.log(res);
            };
        });
        requestStream.on("response", (response) => {
            this.requestObjectmap.add(requestStream);
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            } else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
            }
        });
        let changeObservable = Observable.fromEvent(requestStream, "data");
        requestStream.on("end", () => {
            this.requestObjectmap.remove(requestStream);
        });
        return changeObservable;
    }
    request(methodArg: string, routeArg: string, queryArg: string = "", dataArg = {}) {
        let done = plugins.q.defer();
        let jsonArg: string = JSON.stringify(dataArg);
        let suffix: string = "";
        if (methodArg == "GET") suffix = "/json";
        let options = {
            method: methodArg,
            url: this.sockPath + routeArg + suffix + queryArg,
            headers: {
                "Content-Type": "application/json",
                "Host": "docker.sock"
            },
            body: jsonArg
        };
        //console.log(options);
        plugins.request(options, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                var responseObj = JSON.parse(body);
                done.resolve(responseObj);
            } else {
                console.log(err);
                console.log(res);
                done.reject(err);
            };
        });
        return done.promise;
    }
    requestStream(methodArg: string, routeArg: string, queryArg: string = "", dataArg = {}) {
        let done = plugins.q.defer();
        let jsonArg: string = JSON.stringify(dataArg);
        let suffix: string = "";
        let options = {
            method: methodArg,
            url: this.sockPath + routeArg + suffix + queryArg,
            headers: {
                "Content-Type": "application/json",
                "Host": "docker.sock"
            },
            body: jsonArg
        };
        let requestStream = plugins.request(options, (err, res, body) => {
            if (!err && res.statusCode == 200) {
                done.resolve();
            } else {
                console.log(err);
                console.log(res);
                done.reject(err);
            };
        });
        requestStream.on("response", (response) => {
            this.requestObjectmap.add(requestStream);
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            } else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
                done.reject(response);
            }
        });
        requestStream.on("data", (data: Buffer) => {
            let status;
            status = JSON.parse(data.toString()).status;
            plugins.beautylog.logReduced(status);
        });
        requestStream.on("end", () => {
            this.requestObjectmap.remove(requestStream);
        });
        return done.promise;
    };
    endRequests() {
        setTimeout(() => {
            this.requestObjectmap.forEach((itemArg: plugins.request.Request) => {
                itemArg.emit("end");
            });
            this.requestObjectmap.wipe();
        }, 5000);
    };
}