"use strict";
require("typings-global");
var plugins = require("./dockersock.plugins");
var rxjs_1 = require("rxjs");
var Dockersock = (function () {
    function Dockersock(pathArg) {
        if (pathArg === void 0) { pathArg = "http://unix:/var/run/docker.sock:"; }
        this.sockPath = pathArg;
    }
    // methods
    Dockersock.prototype.auth = function (userArg, passArg) {
        var done = plugins.q.defer();
        this.request("POST", "");
        return done.promise;
    };
    Dockersock.prototype.listContainers = function () {
        var done = plugins.q.defer();
        this.request("GET", "/containers")
            .then(done.resolve);
        return done.promise;
    };
    ;
    Dockersock.prototype.listContainersDetailed = function () {
        var _this = this;
        var done = plugins.q.defer();
        var detailedDataObject = [];
        this.listContainers()
            .then(function (dataArg) {
            var recursiveCounter = 0;
            var makeDetailed = function () {
                if (typeof dataArg[recursiveCounter] != "undefined") {
                    _this.request("GET", "/containers/" + dataArg[recursiveCounter].Id)
                        .then(function (dataArg2) {
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
    };
    ;
    Dockersock.prototype.listContainersRunning = function () {
        var done = plugins.q.defer();
        return done.promise;
    };
    Dockersock.prototype.listContainersStopped = function () {
        var done = plugins.q.defer();
        return done.promise;
    };
    Dockersock.prototype.listImages = function () {
        return this.request("GET", "/images", "?all=true");
    };
    Dockersock.prototype.listImagesDangling = function () {
        return this.request("GET", "/images", "?dangling=true");
    };
    Dockersock.prototype.pullImage = function (imageLabel) {
        return this.requestStream("POST", "/images/create?fromImage=" + imageLabel);
    };
    ;
    Dockersock.prototype.createContainer = function (optionsArg, pullFirstArg) {
        var _this = this;
        if (pullFirstArg === void 0) { pullFirstArg = true; }
        var done = plugins.q.defer();
        var create = function () {
            return _this.request("POST", "/containers/create", "", optionsArg);
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
    };
    ;
    Dockersock.prototype.getContainerId = function () {
    };
    ;
    Dockersock.prototype.startContainer = function (containerNameArg) {
        return this.request("POST", "/containers/" + containerNameArg + "/start");
    };
    ;
    Dockersock.prototype.stopContainer = function (containerNameArg) {
        return this.request("POST", "/containers/" + containerNameArg + "/stop");
    };
    ;
    Dockersock.prototype.removeContainer = function (containerNameArg) {
        return this.request("DELETE", "/containers/" + containerNameArg + "?v=1");
    };
    ;
    Dockersock.prototype.clean = function () {
        var done = plugins.q.defer();
        return done.promise;
    };
    ;
    Dockersock.prototype.callOnChange = function (cb) {
        var cbPromise;
        var changeBuffered = false; // when cb is running then buffer any consequent change
        var requestStream = plugins.request.get(this.sockPath + "/events");
        requestStream.on("response", function (response) {
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            }
            else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
            }
        });
        requestStream.on("data", function (data) {
            var status = JSON.parse(data.toString()).status;
            plugins.beautylog.logReduced(status);
            if (typeof cbPromise == "undefined" || cbPromise.state == "pending") {
                cbPromise = cb();
            }
            else if (changeBuffered) {
                changeBuffered = true;
                cbPromise.then(function () {
                    changeBuffered = false;
                    cbPromise = cb();
                });
            }
        });
        requestStream.on("end", function () {
        });
    };
    ;
    Dockersock.prototype.getChangeObservable = function () {
        var requestStream = plugins.request.get(this.sockPath + "/events");
        requestStream.on("response", function (response) {
            if (response.statusCode == 200) {
                plugins.beautylog.ok("request returned status 200, so we are good!");
            }
            else {
                plugins.beautylog.error("request returned error: " + response.statusCode);
            }
        });
        var changeObservable = rxjs_1.Observable.fromEvent(requestStream, "data");
        requestStream.on("end", function () {
        });
        return changeObservable;
    };
    Dockersock.prototype.request = function (methodArg, routeArg, queryArg, dataArg) {
        if (queryArg === void 0) { queryArg = ""; }
        if (dataArg === void 0) { dataArg = {}; }
        var done = plugins.q.defer();
        var jsonArg = JSON.stringify(dataArg);
        var suffix = "";
        if (methodArg == "GET")
            suffix = "/json";
        var options = {
            method: methodArg,
            url: this.sockPath + routeArg + suffix + queryArg,
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonArg
        };
        plugins.request(options, function (err, res, body) {
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
    };
    Dockersock.prototype.requestStream = function (methodArg, routeArg, endArg) {
        if (endArg === void 0) { endArg = true; }
        var done = plugins.q.defer();
        if (methodArg == "POST") {
            var requestStream = plugins.request.post(this.sockPath + routeArg);
            requestStream.on("response", function (response) {
                if (response.statusCode == 200) {
                    plugins.beautylog.ok("request returned status 200, so we are good!");
                }
                else {
                    plugins.beautylog.error("request returned error: " + response.statusCode);
                    done.reject(response);
                }
            });
            requestStream.on("data", function (data) {
                var status = JSON.parse(data.toString()).status;
                plugins.beautylog.logReduced(status);
            });
            requestStream.on("end", function () {
                done.resolve();
            });
        }
        return done.promise;
    };
    return Dockersock;
}());
exports.Dockersock = Dockersock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9ja2Vyc29jay5jbGFzc2VzLmRvY2tlcnNvY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi90cy9kb2NrZXJzb2NrLmNsYXNzZXMuZG9ja2Vyc29jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsUUFBTyxnQkFDUCxDQUFDLENBRHNCO0FBQ3ZCLElBQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDaEQscUJBQXlCLE1BQU0sQ0FBQyxDQUFBO0FBRWhDO0lBRUksb0JBQVksT0FBb0Q7UUFBcEQsdUJBQW9ELEdBQXBELDZDQUFvRDtRQUM1RCxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUM1QixDQUFDO0lBRUQsVUFBVTtJQUNWLHlCQUFJLEdBQUosVUFBSyxPQUFjLEVBQUMsT0FBYztRQUM5QixJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFDRCxtQ0FBYyxHQUFkO1FBQ0ksSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxhQUFhLENBQUM7YUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDOztJQUNELDJDQUFzQixHQUF0QjtRQUFBLGlCQXNCQztRQXJCRyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLElBQUksa0JBQWtCLEdBQUcsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxjQUFjLEVBQUU7YUFDaEIsSUFBSSxD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