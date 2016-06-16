"use strict";
require("typings-global");
var plugins = require("./dockersock.plugins");
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
    };
    ;
    Dockersock.prototype.createContainer = function () {
        return this.request("POST", "/containers/create", "", {
            "image": ""
        });
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
    Dockersock.prototype.getChange = function () {
    };
    ;
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
    return Dockersock;
}());
exports.Dockersock = Dockersock;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvY2tlcnNvY2suY2xhc3Nlcy5kb2NrZXJzb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxRQUFPLGdCQUNQLENBQUMsQ0FEc0I7QUFDdkIsSUFBWSxPQUFPLFdBQU0sc0JBQXNCLENBQUMsQ0FBQTtBQUVoRDtJQUVJLG9CQUFZLE9BQW9EO1FBQXBELHVCQUFvRCxHQUFwRCw2Q0FBb0Q7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELFVBQVU7SUFDVix5QkFBSSxHQUFKLFVBQUssT0FBYyxFQUFDLE9BQWM7UUFDOUIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBQyxFQUFFLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBQ0QsbUNBQWMsR0FBZDtRQUNJLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsYUFBYSxDQUFDO2FBQzVCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQzs7SUFDRCwyQ0FBc0IsR0FBdEI7UUFBQSxpQkFzQkM7UUFyQkcsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLGtCQUFrQixHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsY0FBYyxFQUFFO2FBQ2hCLElBQUksQ0FBQyxVQUFDLE9BQU87WUFDVixJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztZQUN6QixJQUFJLFlBQVksR0FBRztnQkFDZixFQUFFLENBQUEsQ0FBQyxPQUFP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dXJjZXNDb250ZW50IjpbImltcG9ydCBcInR5cGluZ3MtZ2xvYmFsXCJcbmltcG9ydCAqIGFzIHBsdWdpbnMgZnJvbSBcIi4vZG9ja2Vyc29jay5wbHVnaW5zXCI7XG5cbmV4cG9ydCBjbGFzcyBEb2NrZXJzb2NrIHtcbiAgICBzb2NrUGF0aDpzdHJpbmc7XG4gICAgY29uc3RydWN0b3IocGF0aEFyZzpzdHJpbmcgPSBcImh0dHA6Ly91bml4Oi92YXIvcnVuL2RvY2tlci5zb2NrOlwiKXtcbiAgICAgICAgdGhpcy5zb2NrUGF0aCA9IHBhdGhBcmc7XG4gICAgfVxuXG4gICAgLy8gbWV0aG9kc1xuICAgIGF1dGgodXNlckFyZzpzdHJpbmcscGFzc0FyZzpzdHJpbmcpe1xuICAgICAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgICAgICB0aGlzLnJlcXVlc3QoXCJQT1NUXCIsXCJcIik7XG4gICAgICAgIHJldHVybiBkb25lLnByb21pc2U7XG4gICAgfVxuICAgIGxpc3RDb250YWluZXJzKCkge1xuICAgICAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgICAgICB0aGlzLnJlcXVlc3QoXCJHRVRcIixcIi9jb250YWluZXJzXCIpXG4gICAgICAgICAgICAudGhlbihkb25lLnJlc29sdmUpO1xuICAgICAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xuICAgIH07XG4gICAgbGlzdENvbnRhaW5lcnNEZXRhaWxlZCgpIHtcbiAgICAgICAgbGV0IGRvbmUgPSBwbHVnaW5zLnEuZGVmZXIoKTtcbiAgICAgICAgbGV0IGRldGFpbGVkRGF0YU9iamVjdCA9IFtdO1xuICAgICAgICB0aGlzLmxpc3RDb250YWluZXJzKClcbiAgICAgICAgICAgIC50aGVuKChkYXRhQXJnKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlY3Vyc2l2ZUNvdW50ZXIgPSAwO1xuICAgICAgICAgICAgICAgIGxldCBtYWtlRGV0YWlsZWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBkYXRhQXJnW3JlY3Vyc2l2ZUNvdW50ZXJdICE9IFwidW5kZWZpbmVkXCIpe1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0KFwiR0VUXCIsXCIvY29udGFpbmVycy9cIiArIGRhdGFBcmdbcmVjdXJzaXZlQ291bnRlcl0uSWQpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oKGRhdGFBcmcyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldGFpbGVkRGF0YU9iamVjdC5wdXNoKGRhdGFBcmcyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzaXZlQ291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZWN1cnNpdmUgY2FsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWtlRGV0YWlsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUucmVzb2x2ZShkZXRhaWxlZERhdGFPYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBtYWtlRGV0YWlsZWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xuICAgIH07XG4gICAgbGlzdENvbnRhaW5lcnNSdW5uaW5nKCkge1xuICAgICAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgICAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xuICAgIH1cbiAgICBsaXN0Q29udGFpbmVyc1N0b3BwZWQoKSB7XG4gICAgICAgIGxldCBkb25lID0gcGx1Z2lucy5xLmRlZmVyKCk7XG4gICAgICAgIHJldHVybiBkb25lLnByb21pc2U7XG4gICAgfVxuICAgIGxpc3RJbWFnZXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXCJHRVRcIixcIi9pbWFnZXNcIixcIj9hbGw9dHJ1ZVwiKTtcbiAgICB9XG4gICAgbGlzdEltYWdlc0RhbmdsaW5nKCl7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXCJHRVRcIixcIi9pbWFnZXNcIixcIj9kYW5nbGluZz10cnVlXCIpO1xuICAgIH1cbiAgICBwdWxsSW1hZ2UoaW1hZ2VMYWJlbDpzdHJpbmcpe1xuXG4gICAgfTtcbiAgICBjcmVhdGVDb250YWluZXIoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChcIlBPU1RcIixcIi9jb250YWluZXJzL2NyZWF0ZVwiLFwiXCIse1xuICAgICAgICAgICAgXCJpbWFnZVwiOlwiXCJcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRDb250YWluZXJJZCgpe1xuXG4gICAgfTtcbiAgICBzdGFydENvbnRhaW5lcihjb250YWluZXJOYW1lQXJnKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChcIlBPU1RcIixcIi9jb250YWluZXJzL1wiKyBjb250YWluZXJOYW1lQXJnICtcIi9zdGFydFwiKTtcbiAgICB9O1xuICAgIHN0b3BDb250YWluZXIoY29udGFpbmVyTmFtZUFyZyl7XG4gICAgICAgIHJldHVybiB0aGlzLnJlcXVlc3QoXCJQT1NUXCIsXCIvY29udGFpbmVycy9cIisgY29udGFpbmVyTmFtZUFyZyArXCIvc3RvcFwiKTtcbiAgICB9O1xuICAgIHJlbW92ZUNvbnRhaW5lcihjb250YWluZXJOYW1lQXJnKXtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdChcIkRFTEVURVwiLFwiL2NvbnRhaW5lcnMvXCIgKyBjb250YWluZXJOYW1lQXJnICsgXCI/dj0xXCIpO1xuICAgIH07XG4gICAgY2xlYW4oKSB7XG4gICAgICAgIGxldCBkb25lID0gcGx1Z2lucy5xLmRlZmVyKCk7XG4gICAgICAgIHJldHVybiBkb25lLnByb21pc2U7XG4gICAgfTtcbiAgICBnZXRDaGFuZ2UoKXtcblxuICAgIH07XG4gICAgcmVxdWVzdChtZXRob2RBcmc6c3RyaW5nLHJvdXRlQXJnOnN0cmluZyxxdWVyeUFyZzpzdHJpbmcgPSBcIlwiLCBkYXRhQXJnID0ge30pe1xuICAgICAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgICAgICBsZXQganNvbkFyZzpzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShkYXRhQXJnKTtcbiAgICAgICAgbGV0IHN1ZmZpeDpzdHJpbmcgPSBcIlwiO1xuICAgICAgICBpZihtZXRob2RBcmcgPT0gXCJHRVRcIikgc3VmZml4ID0gXCIvanNvblwiO1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDptZXRob2RBcmcsXG4gICAgICAgICAgICB1cmw6dGhpcy5zb2NrUGF0aCArIHJvdXRlQXJnICsgc3VmZml4ICsgcXVlcnlBcmcsXG4gICAgICAgICAgICBoZWFkZXJzOntcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTpqc29uQXJnXG4gICAgICAgIH07XG4gICAgICAgIHBsdWdpbnMucmVxdWVzdChvcHRpb25zLChlcnIsIHJlcywgYm9keSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFlcnIgJiYgcmVzLnN0YXR1c0NvZGUgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlT2JqID0gSlNPTi5wYXJzZShib2R5KTtcbiAgICAgICAgICAgICAgICBkb25lLnJlc29sdmUocmVzcG9uc2VPYmopO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICAgICAgZG9uZS5yZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xuICAgIH1cbn0iXX0=
