"use strict";
require("typings-global");
const plugins = require("./dockersock.plugins");
const rxjs_1 = require("rxjs");
class Dockersock {
    constructor(pathArg = "http://unix:/var/run/docker.sock:") {
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
    pullImage(imageLabel) {
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
        let requestStream = plugins.request.get(this.sockPath + "/events");
        requestStream.on("response", (response) => {
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            }
            else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
            }
        });
        let changeObservable = rxjs_1.Observable.fromEvent(requestStream, "data");
        requestStream.on("end", () => {
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
                "Content-Type": "application/json"
            },
            body: jsonArg
        };
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
    requestStream(methodArg, routeArg, endArg = true) {
        let done = plugins.q.defer();
        if (methodArg == "POST") {
            let requestStream = plugins.request.post(this.sockPath + routeArg);
            requestStream.on("response", (response) => {
                if (response.statusCode == 200) {
                    plugins.beautylog.ok("request returned status 200, so we are good!");
                }
                else {
                    plugins.beautylog.error("request returned error: " + response.statusCode);
                    done.reject(response);
                }
            });
            requestStream.on("data", (data) => {
                let status = JSON.parse(data.toString()).status;
                plugins.beautylog.logReduced(status);
            });
            requestStream.on("end", () => {
                done.resolve();
            });
        }
        return done.promise;
    }
}
exports.Dockersock = Dockersock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2Vyc29jay5jbGFzc2VzLmRvY2tlcnNvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9kb2NrZXJzb2NrLmNsYXNzZXMuZG9ja2Vyc29jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsUUFBTyxnQkFDUCxDQUFDLENBRHNCO0FBQ3ZCLE1BQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsdUJBQXlCLE1BQU0sQ0FBQyxDQUFBO0FBRWhDO0lBRUksWUFBWSxPQUFPLEdBQVUsbUNBQW1DO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRCxVQUFVO0lBQ1YsSUFBSSxDQUFDLE9BQWMsRUFBQyxPQUFjO1FBQzlCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUNELGNBQWM7UUFDVixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLGFBQWEsQ0FBQzthQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7O0lBQ0Qsc0JBQXNCO1FBQ2xCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsRUFBRTthQUNoQixJQUFJLENBQUMsQ0FBQyxPQUFPO1lBQ1YsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7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