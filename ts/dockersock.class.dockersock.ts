import "typings-global"
import * as plugins from "./dockersock.plugins";

export class dockersock {
    sockPath:string;
    constructor(pathArg:string){
        this.sockPath = pathArg;
    }
    
    request(methodArg:string,routeArg:string,dataArg = {}){
        let done = plugins.q.defer();
        let jsonArg:string = JSON.stringify(dataArg);
        let options = {
            method:methodArg,
            url:"http://unix:/var/run/docker.sock:" + routeArg + "/json",
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