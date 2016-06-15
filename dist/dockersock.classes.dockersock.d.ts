import "typings-global";
export declare class Dockersock {
    sockPath: string;
    constructor(pathArg?: string);
    listContainers(): any;
    listContainersDetailed(): any;
    listContainersRunning(): any;
    listContainersStopped(): any;
    listImages(): any;
    clean(): any;
    request(methodArg: string, routeArg: string, dataArg?: {}): any;
}
