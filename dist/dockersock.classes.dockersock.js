"use strict";
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
        requestStream.on("response", (response) => {
            this.requestObjectmap.add(response);
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            }
            else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
            }
        });
        let changeObservable = rxjs_1.Observable.fromEvent(requestStream, "data");
        requestStream.on("end", () => {
            this.requestObjectmap.remove(requestStream);
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
        requestStream.on("response", (response) => {
            this.requestObjectmap.add(response);
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
            this.requestObjectmap.remove(requestStream);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2Vyc29jay5jbGFzc2VzLmRvY2tlcnNvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9kb2NrZXJzb2NrLmNsYXNzZXMuZG9ja2Vyc29jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsUUFBTyxnQkFDUCxDQUFDLENBRHNCO0FBQ3ZCLE1BQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsdUJBQTJCLE1BQU0sQ0FBQyxDQUFBO0FBRWxDO0lBR0ksWUFBWSxPQUFPLEdBQVcsbUNBQW1DO1FBRGpFLHFCQUFnQixHQUEwQixJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLENBQUM7UUFFbEUsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELFVBQVU7SUFDVixJQUFJLENBQUMsT0FBZSxFQUFFLE9BQWU7UUFDakMsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBQ0QsY0FBYztRQUNWLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDO2FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQzs7SUFDRCxzQkFBc0I7UUFDbEIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsY0FBYyxFQUFF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