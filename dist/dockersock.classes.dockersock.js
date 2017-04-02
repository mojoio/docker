"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("typings-global");
const plugins = require("./dockersock.plugins");
const rxjs_1 = require("rxjs");
class Dockersock {
    constructor(pathArg = "http://unix:/var/run/docker.sock:") {
        this.requestObjectmap = new plugins.lik.Objectmap();
        this.sockPath = pathArg;
    }
    // methods
    auth(userArg, passArg) {
        let done = plugins.q.defer();
        this.request("POST", "");
        return done.promise;
    }
    listContainers() {
        let done = plugins.q.defer();
        this.request("GET", "/containers")
            .then(done.resolve);
        return done.promise;
    }
    ;
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
                }
                else {
                    done.resolve(detailedDataObject);
                }
            };
            makeDetailed();
        });
        return done.promise;
    }
    ;
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
    pullImage(imageLabelArg) {
        let imageLabel = encodeURI(imageLabelArg);
        return this.requestStream("POST", "/images/create?fromImage=" + imageLabel);
    }
    ;
    createContainer(optionsArg, pullFirstArg = true) {
        let done = plugins.q.defer();
        let create = () => {
            return this.request("POST", "/containers/create", "", optionsArg);
        };
        if (pullFirstArg) {
            this.pullImage(optionsArg.Image)
                .then(create)
                .then(done.resolve);
        }
        else {
            create()
                .then(done.resolve);
        }
        return done.promise;
    }
    ;
    getContainerId() {
    }
    ;
    startContainer(containerNameArg) {
        return this.request("POST", "/containers/" + containerNameArg + "/start");
    }
    ;
    stopContainer(containerNameArg) {
        return this.request("POST", "/containers/" + containerNameArg + "/stop");
    }
    ;
    removeContainer(containerNameArg) {
        return this.request("DELETE", "/containers/" + containerNameArg + "?v=1");
    }
    ;
    clean() {
        let done = plugins.q.defer();
        return done.promise;
    }
    ;
    callOnChange(cb) {
        let cbPromise;
        let changeBuffered = false; // when cb is running then buffer any consequent change
        let requestStream = plugins.request.get(this.sockPath + "/events");
        requestStream.on("response", (response) => {
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            }
            else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
            }
        });
        requestStream.on("data", (data) => {
            let status = JSON.parse(data.toString()).status;
            plugins.beautylog.logReduced(status);
            if (typeof cbPromise == "undefined" || cbPromise.state == "pending") {
                cbPromise = cb();
            }
            else if (changeBuffered) {
                changeBuffered = true;
                cbPromise.then(() => {
                    changeBuffered = false;
                    cbPromise = cb();
                });
            }
        });
        requestStream.on("end", () => {
        });
    }
    ;
    /**
     * gets you an observable that reports changes in the docker infrastructure
     */
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
            }
            else {
                console.log(err);
                console.log(res);
            }
            ;
        });
        let incomingMessage;
        requestStream.on("response", (response) => {
            incomingMessage = response;
            this.requestObjectmap.add(incomingMessage);
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            }
            else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
            }
        });
        let changeObservable = rxjs_1.Observable.fromEvent(requestStream, "data");
        requestStream.on("end", () => {
            this.requestObjectmap.remove(incomingMessage);
        });
        return changeObservable;
    }
    request(methodArg, routeArg, queryArg = "", dataArg = {}) {
        let done = plugins.q.defer();
        let jsonArg = JSON.stringify(dataArg);
        let suffix = "";
        if (methodArg == "GET")
            suffix = "/json";
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
            }
            else {
                console.log(err);
                console.log(res);
                done.reject(err);
            }
            ;
        });
        return done.promise;
    }
    requestStream(methodArg, routeArg, queryArg = "", dataArg = {}) {
        let done = plugins.q.defer();
        let jsonArg = JSON.stringify(dataArg);
        let suffix = "";
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
            }
            else {
                console.log(err);
                console.log(res);
                done.reject(err);
            }
            ;
        });
        let incomingMessage;
        requestStream.on("response", (response) => {
            incomingMessage = response;
            this.requestObjectmap.add(incomingMessage);
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            }
            else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
                done.reject(response);
            }
        });
        requestStream.on("data", (data) => {
            let status;
            status = JSON.parse(data.toString()).status;
            plugins.beautylog.logReduced(status);
        });
        requestStream.on("end", () => {
            this.requestObjectmap.remove(incomingMessage);
        });
        return done.promise;
    }
    ;
    endRequests() {
        setTimeout(() => {
            this.requestObjectmap.forEach((itemArg) => {
                itemArg.emit("end");
            });
            this.requestObjectmap.wipe();
        }, 5000);
    }
    ;
}
exports.Dockersock = Dockersock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2Vyc29jay5jbGFzc2VzLmRvY2tlcnNvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9kb2NrZXJzb2NrLmNsYXNzZXMuZG9ja2Vyc29jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBCQUF1QjtBQUN2QixnREFBZ0Q7QUFDaEQsK0JBQWtDO0FBS2xDO0lBR0ksWUFBWSxVQUFrQixtQ0FBbUM7UUFEakUscUJBQWdCLEdBQUcsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBMkIsQ0FBQztRQUVwRSxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQsVUFBVTtJQUNWLElBQUksQ0FBQyxPQUFlLEVBQUUsT0FBZTtRQUNqQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxjQUFjO1FBQ1YsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUM7YUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBQUEsQ0FBQztJQUNGLHNCQUFzQjtRQUNsQixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLElBQUksa0JBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxjQUFjLEVBQUU7YUFDaEIsSUFBSSxDQUFDLENBQUMsT0FBTztZQUNWLElBQUksZ0JBQWdCLEdBQUcs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