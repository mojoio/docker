import "typings-global"
import * as plugins from "./dockersock.plugins";

export class dockersock {
    sockPath:string;
    constructor(pathArg:string){
        this.sockPath = pathArg;
    }
    request(){
        
    }
}