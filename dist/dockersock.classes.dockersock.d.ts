import "typings-global";
export declare class Dockersock {
    sockPath: string;
    constructor(pathArg?: string);
    auth(userArg: string, passArg: string): any;
    listContainers(): any;
    listContainersDetailed(): any;
    listContainersRunning(): any;
    listContainersStopped(): any;
    listImages(): any;
    getContainerId(): void;
    startContainer(containerNameArg: any): any;
    stopContainer(): any;
    clean(): any;
    getChange(): void;
    request(methodArg: string, routeArg: string, dataArg?: {}): any;
}
