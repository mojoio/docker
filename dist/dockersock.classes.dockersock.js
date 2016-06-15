"use strict";
require("typings-global");
var plugins = require("./dockersock.plugins");
var Dockersock = (function () {
    function Dockersock(pathArg) {
        if (pathArg === void 0) { pathArg = "http://unix:/var/run/docker.sock:"; }
        this.sockPath = pathArg;
    }
    // methods
    Dockersock.prototype.listContainers = function () {
        var done = plugins.q.defer();
        this.request("GET", "/containers")
            .then(done.resolve);
        return done.promise;
    };
    ;
    Dockersock.prototype.listContainersDetailed = function () {
        var done = plugins.q.defer();
        var detailedDataObject = [];
        this.listContainers()
            .then(function (dataArg) {
            var recursiveCounter = 0;
            var makeDetailed = function () {
                if (typeof dataArg[recursiveCounter] != "undefined") {
                    this.request.get("GET", "/containers/" + dataArg[recursiveCounter].Id)
                        .then(function (data) {
                        recursiveCounter++;
                        detailedDataObject.push(data);
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
        var done = plugins.q.defer();
        return done.promise;
    };
    Dockersock.prototype.clean = function () {
        var done = plugins.q.defer();
        return done.promise;
    };
    Dockersock.prototype.request = function (methodArg, routeArg, dataArg) {
        if (dataArg === void 0) { dataArg = {}; }
        var done = plugins.q.defer();
        var jsonArg = JSON.stringify(dataArg);
        var options = {
            method: methodArg,
            url: this.sockPath + routeArg + "/json",
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvY2tlcnNvY2suY2xhc3Nlcy5kb2NrZXJzb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxRQUFPLGdCQUNQLENBQUMsQ0FEc0I7QUFDdkIsSUFBWSxPQUFPLFdBQU0sc0JBQXNCLENBQUMsQ0FBQTtBQUVoRDtJQUVJLG9CQUFZLE9BQW9EO1FBQXBELHVCQUFvRCxHQUFwRCw2Q0FBb0Q7UUFDNUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELFVBQVU7SUFDVixtQ0FBYyxHQUFkO1FBQ0ksSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxhQUFhLENBQUM7YUFDNUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDOztJQUNELDJDQUFzQixHQUF0QjtRQUNJLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxrQkFBa0IsR0FBRyxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLGNBQWMsRUFBRTthQUNoQixJQUFJLENBQUMsVUFBQyxPQUFPO1lBQ1YsSUFBSSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7WUFDckIsSUFBSSxZQUFZLEdBQUc7Z0JBQ2YsRUFBRSxDQUFBLENBQUMsT0FBTyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQSxDQUFDO29CQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsY0FBYyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQzt5QkFDaEUsSUFBSSxDQUFDLFVBQUMsSUFBSTt3QkFDUCxnQkFBZ0IsRUFBRSxDQUFDO3dCQUNuQixrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQzlCLFlBQVksRUFBRSxDQUFDO29CQUNuQixDQUFDLENBQUMsQ0FBQztnQkFDWCxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztnQkFDckMsQ0FBQztZQUNMLENBQUMsQ0FBQztZQUNGLFlBQVksRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQzs7SUFDRCwwQ0FBcUIsR0FBckI7UUFDSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFDRCwwQ0FBcUIsR0FBckI7UUFDSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFDRCwrQkFBVSxHQUFWO1FBQ0ksSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBQ0QsMEJBQUssR0FBTDtRQUNJLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDeEIsQ0FBQztJQUVELDRCQUFPLEdBQVAsVUFBUSxTQUFnQixFQUFDLFFBQWUsRUFBQyxPQUFZO1FBQVosdUJBQVksR0FBWixZQUFZO1FBQ2pELElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDN0IsSUFBSSxPQUFPLEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QyxJQUFJLE9BQU8sR0FBRztZQUNWLE1BQU0sRUFBQyxTQUFTO1lBQ2hCLEdBQUcsRUFBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsR0FBRyxPQUFPO1lBQ3RDLE9BQU8sRUFBQztnQkFDSixjQUFjLEVBQUMsa0JBQWtCO2FBQ3BDO1lBQ0QsSUFBSSxFQUFDLE9BQU87U0FDZixDQUFDO1FBQ0YsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUMsVUFBUyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUk7WUFDM0MsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQzlCLENBQUM7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDSixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLENBQUM7WUFBQSxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7UUFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztJQUN4QixDQUFDO0lBQ0wsaUJBQUM7QUFBRCxDQTNFQSxBQTJFQyxJQUFBO0FBM0VZLGtCQUFVLGFBMkV0QixDQUFBIiwiZmlsZSI6ImRvY2tlcnNvY2suY2xhc3Nlcy5kb2NrZXJzb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwidHlwaW5ncy1nbG9iYWxcIlxuaW1wb3J0ICogYXMgcGx1Z2lucyBmcm9tIFwiLi9kb2NrZXJzb2NrLnBsdWdpbnNcIjtcblxuZXhwb3J0IGNsYXNzIERvY2tlcnNvY2sge1xuICAgIHNvY2tQYXRoOnN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihwYXRoQXJnOnN0cmluZyA9IFwiaHR0cDovL3VuaXg6L3Zhci9ydW4vZG9ja2VyLnNvY2s6XCIpe1xuICAgICAgICB0aGlzLnNvY2tQYXRoID0gcGF0aEFyZztcbiAgICB9XG5cbiAgICAvLyBtZXRob2RzXG4gICAgbGlzdENvbnRhaW5lcnMoKSB7XG4gICAgICAgIGxldCBkb25lID0gcGx1Z2lucy5xLmRlZmVyKCk7XG4gICAgICAgIHRoaXMucmVxdWVzdChcIkdFVFwiLFwiL2NvbnRhaW5lcnNcIilcbiAgICAgICAgICAgIC50aGVuKGRvbmUucmVzb2x2ZSk7XG4gICAgICAgIHJldHVybiBkb25lLnByb21pc2U7XG4gICAgfTtcbiAgICBsaXN0Q29udGFpbmVyc0RldGFpbGVkKCkge1xuICAgICAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgICAgICBsZXQgZGV0YWlsZWREYXRhT2JqZWN0ID0gW107XG4gICAgICAgIHRoaXMubGlzdENvbnRhaW5lcnMoKVxuICAgICAgICAgICAgLnRoZW4oKGRhdGFBcmcpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVjdXJzaXZlQ291bnRlciA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGxldCBtYWtlRGV0YWlsZWQgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIGRhdGFBcmdbcmVjdXJzaXZlQ291bnRlcl0gIT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZXF1ZXN0LmdldChcIkdFVFwiLFwiL2NvbnRhaW5lcnMvXCIgKyBkYXRhQXJnW3JlY3Vyc2l2ZUNvdW50ZXJdLklkKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVjdXJzaXZlQ291bnRlcisrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV0YWlsZWREYXRhT2JqZWN0LnB1c2goZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYWtlRGV0YWlsZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvbmUucmVzb2x2ZShkZXRhaWxlZERhdGFPYmplY3QpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBtYWtlRGV0YWlsZWQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xuICAgIH07XG4gICAgbGlzdENvbnRhaW5lcnNSdW5uaW5nKCkge1xuICAgICAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgICAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xuICAgIH1cbiAgICBsaXN0Q29udGFpbmVyc1N0b3BwZWQoKSB7XG4gICAgICAgIGxldCBkb25lID0gcGx1Z2lucy5xLmRlZmVyKCk7XG4gICAgICAgIHJldHVybiBkb25lLnByb21pc2U7XG4gICAgfVxuICAgIGxpc3RJbWFnZXMoKSB7XG4gICAgICAgIGxldCBkb25lID0gcGx1Z2lucy5xLmRlZmVyKCk7XG4gICAgICAgIHJldHVybiBkb25lLnByb21pc2U7XG4gICAgfVxuICAgIGNsZWFuKCkge1xuICAgICAgICBsZXQgZG9uZSA9IHBsdWdpbnMucS5kZWZlcigpO1xuICAgICAgICByZXR1cm4gZG9uZS5wcm9taXNlO1xuICAgIH1cblxuICAgIHJlcXVlc3QobWV0aG9kQXJnOnN0cmluZyxyb3V0ZUFyZzpzdHJpbmcsZGF0YUFyZyA9IHt9KXtcbiAgICAgICAgbGV0IGRvbmUgPSBwbHVnaW5zLnEuZGVmZXIoKTtcbiAgICAgICAgbGV0IGpzb25Bcmc6c3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZGF0YUFyZyk7XG4gICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgbWV0aG9kOm1ldGhvZEFyZyxcbiAgICAgICAgICAgIHVybDp0aGlzLnNvY2tQYXRoICsgcm91dGVBcmcgKyBcIi9qc29uXCIsXG4gICAgICAgICAgICBoZWFkZXJzOntcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24vanNvblwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTpqc29uQXJnXG4gICAgICAgIH07XG4gICAgICAgIHBsdWdpbnMucmVxdWVzdChvcHRpb25zLGZ1bmN0aW9uKGVyciwgcmVzLCBib2R5KXtcbiAgICAgICAgICAgIGlmICghZXJyICYmIHJlcy5zdGF0dXNDb2RlID09IDIwMCkge1xuICAgICAgICAgICAgICAgIHZhciByZXNwb25zZU9iaiA9IEpTT04ucGFyc2UoYm9keSk7XG4gICAgICAgICAgICAgICAgZG9uZS5yZXNvbHZlKHJlc3BvbnNlT2JqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgICAgIGRvbmUucmVqZWN0KGVycik7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGRvbmUucHJvbWlzZTtcbiAgICB9XG59Il19
