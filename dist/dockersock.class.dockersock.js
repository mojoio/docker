"use strict";
require("typings-global");
var plugins = require("./dockersock.plugins");
var dockersock = (function () {
    function dockersock(pathArg) {
        this.sockPath = pathArg;
    }
    dockersock.prototype.request = function (methodArg, routeArg, dataArg) {
        if (dataArg === void 0) { dataArg = {}; }
        var done = plugins.q.defer();
        var jsonArg = JSON.stringify(dataArg);
        var options = {
            method: methodArg,
            url: "http://unix:/var/run/docker.sock:" + routeArg + "/json",
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
    return dockersock;
}());
exports.dockersock = dockersock;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRvY2tlcnNvY2suY2xhc3MuZG9ja2Vyc29jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsUUFBTyxnQkFDUCxDQUFDLENBRHNCO0FBQ3ZCLElBQVksT0FBTyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFFaEQ7SUFFSSxvQkFBWSxPQUFjO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRCw0QkFBTyxHQUFQLFVBQVEsU0FBZ0IsRUFBQyxRQUFlLEVBQUMsT0FBWTtRQUFaLHVCQUFZLEdBQVosWUFBWTtRQUNqRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLElBQUksT0FBTyxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDN0MsSUFBSSxPQUFPLEdBQUc7WUFDVixNQUFNLEVBQUMsU0FBUztZQUNoQixHQUFHLEVBQUMsbUNBQW1DLEdBQUcsUUFBUSxHQUFHLE9BQU87WUFDNUQsT0FBTyxFQUFDO2dCQUNKLGNBQWMsRUFBQyxrQkFBa0I7YUFDcEM7WUFDRCxJQUFJLEVBQUMsT0FBTztTQUNmLENBQUM7UUFDRixPQUFPLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBQyxVQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSTtZQUMzQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQUMsVUFBVSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDckIsQ0FBQztZQUFBLENBQUM7UUFDTixDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFDTCxpQkFBQztBQUFELENBN0JBLEFBNkJDLElBQUE7QUE3Qlksa0JBQVUsYUE2QnRCLENBQUEiLCJmaWxlIjoiZG9ja2Vyc29jay5jbGFzcy5kb2NrZXJzb2NrLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwidHlwaW5ncy1nbG9iYWxcIlxuaW1wb3J0ICogYXMgcGx1Z2lucyBmcm9tIFwiLi9kb2NrZXJzb2NrLnBsdWdpbnNcIjtcblxuZXhwb3J0IGNsYXNzIGRvY2tlcnNvY2sge1xuICAgIHNvY2tQYXRoOnN0cmluZztcbiAgICBjb25zdHJ1Y3RvcihwYXRoQXJnOnN0cmluZyl7XG4gICAgICAgIHRoaXMuc29ja1BhdGggPSBwYXRoQXJnO1xuICAgIH1cbiAgICBcbiAgICByZXF1ZXN0KG1ldGhvZEFyZzpzdHJpbmcscm91dGVBcmc6c3RyaW5nLGRhdGFBcmcgPSB7fSl7XG4gICAgICAgIGxldCBkb25lID0gcGx1Z2lucy5xLmRlZmVyKCk7XG4gICAgICAgIGxldCBqc29uQXJnOnN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGRhdGFBcmcpO1xuICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG1ldGhvZDptZXRob2RBcmcsXG4gICAgICAgICAgICB1cmw6XCJodHRwOi8vdW5peDovdmFyL3J1bi9kb2NrZXIuc29jazpcIiArIHJvdXRlQXJnICsgXCIvanNvblwiLFxuICAgICAgICAgICAgaGVhZGVyczp7XG4gICAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL2pzb25cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvZHk6anNvbkFyZ1xuICAgICAgICB9O1xuICAgICAgICBwbHVnaW5zLnJlcXVlc3Qob3B0aW9ucyxmdW5jdGlvbihlcnIsIHJlcywgYm9keSl7XG4gICAgICAgICAgICBpZiAoIWVyciAmJiByZXMuc3RhdHVzQ29kZSA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzcG9uc2VPYmogPSBKU09OLnBhcnNlKGJvZHkpO1xuICAgICAgICAgICAgICAgIGRvbmUucmVzb2x2ZShyZXNwb25zZU9iaik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICAgICBkb25lLnJlamVjdChlcnIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBkb25lLnByb21pc2U7XG4gICAgfVxufSJdfQ==
