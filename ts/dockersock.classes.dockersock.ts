import "typings-global"
import * as plugins from "./dockersock.plugins";

export class Dockersock {
    sockPath:string;
    constructor(pathArg:string = "http://unix:/var/run/docker.sock:"){
        this.sockPath = pathArg;
    }

    // methods
    listContainers() {
        let done = plugins.q.defer();
        this.request("GET","/containers")
            .then(done.resolve);
        return done.promise;
    };
    listContainersDetailed() {
        let done = plugins.q.defer();
        let detailedDataObject = [];
        this.listContainers()
            .then((dataArg) => {
                let recursiveCounter = 0;
                    let makeDetailed = function(){
                        if(typeof dataArg[recursiveCounter] != "undefined"){
                            this.request.get("GET","/containers/" + dataArg[recursiveCounter].Id)
                                .then((data) => {
                                    recursiveCounter++;
                                    detailedDataObject.push(data);
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
        let done = plugins.q.defer();
        return done.promise;
    }
    clean() {
        let done = plugins.q.defer();
        return done.promise;
    }

    request(methodArg:string,routeArg:string,dataArg = {}){
        let done = plugins.q.defer();
        let jsonArg:string = JSON.stringify(dataArg);
        let options = {
            method:methodArg,
            url:this.sockPath + routeArg + "/json",
            headers:{
                "Content-Type":"application/json"
            },
            body:jsonArg
        };
        plugins.request(options,function(err, res, body){
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
}