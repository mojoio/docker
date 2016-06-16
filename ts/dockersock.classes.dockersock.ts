import "typings-global"
import * as plugins from "./dockersock.plugins";

export class Dockersock {
    sockPath:string;
    constructor(pathArg:string = "http://unix:/var/run/docker.sock:"){
        this.sockPath = pathArg;
    }

    // methods
    auth(userArg:string,passArg:string){
        let done = plugins.q.defer();
        this.request("POST","");
        return done.promise;
    }
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
                let makeDetailed = () => {
                    if(typeof dataArg[recursiveCounter] != "undefined"){
                        this.request("GET","/containers/" + dataArg[recursiveCounter].Id)
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
        return this.request("GET","/images","?all=true");
    }
    listImagesDangling(){
        return this.request("GET","/images","?dangling=true");
    }
    pullImage(imageLabel:string){
        return this.requestStream("POST","/images/create?fromImage=" + imageLabel);
    };
    createContainer(imageNameArg,pullFirst:boolean = true){
        return this.request("POST","/containers/create","",{
            "image":imageNameArg
        });
    };
    getContainerId(){

    };
    startContainer(containerNameArg){
        return this.request("POST","/containers/"+ containerNameArg +"/start");
    };
    stopContainer(containerNameArg){
        return this.request("POST","/containers/"+ containerNameArg +"/stop");
    };
    removeContainer(containerNameArg){
        return this.request("DELETE","/containers/" + containerNameArg + "?v=1");
    };
    clean() {
        let done = plugins.q.defer();
        return done.promise;
    };
    getChange(){

    };
    request(methodArg:string,routeArg:string,queryArg:string = "", dataArg = {}){
        let done = plugins.q.defer();
        let jsonArg:string = JSON.stringify(dataArg);
        let suffix:string = "";
        if(methodArg == "GET") suffix = "/json";
        let options = {
            method:methodArg,
            url:this.sockPath + routeArg + suffix + queryArg,
            headers:{
                "Content-Type":"application/json"
            },
            body:jsonArg
        };
        plugins.request(options,(err, res, body) => {
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
    requestStream(methodArg,routeArg,endArg:boolean = true){
        let done = plugins.q.defer();
        if(methodArg == "POST"){
            let requestStream = plugins.request.post(this.sockPath + routeArg);
            requestStream.on("response",(response) => {
                    if(response.statusCode == 200){
                        plugins.beautylog.ok("request returned status 200, so we are good!");
                    } else {
                        plugins.beautylog.error("request returned error: " + response.statusCode);
                        done.reject();
                    }
                });
            requestStream.on("data",(data:Buffer) => {
                let status = JSON.parse(data.toString()).status;
                plugins.beautylog.logReduced(status);
            });
            requestStream.on("end",()=> {
                done.resolve();
            });         
        }
        return done.promise;
    }
}