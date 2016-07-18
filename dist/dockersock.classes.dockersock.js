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
        return done.promise;
    }
}
exports.Dockersock = Dockersock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2Vyc29jay5jbGFzc2VzLmRvY2tlcnNvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9kb2NrZXJzb2NrLmNsYXNzZXMuZG9ja2Vyc29jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsUUFBTyxnQkFDUCxDQUFDLENBRHNCO0FBQ3ZCLE1BQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDaEQsdUJBQXlCLE1BQU0sQ0FBQyxDQUFBO0FBRWhDO0lBRUksWUFBWSxPQUFPLEdBQVUsbUNBQW1DO1FBQzVELElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRCxVQUFVO0lBQ1YsSUFBSSxDQUFDLE9BQWMsRUFBQyxPQUFjO1FBQzlCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUNELGNBQWM7UUFDVixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLGFBQWEsQ0FBQzthQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7O0lBQ0Qsc0JBQXNCO1FBQ2xCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsRUFBRTthQUNoQixJQUFJLENBQUMsQ0FBQyxPQUFPO1lBQ1YsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7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