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
    listImagesDangling(): any;
    pullImage(imageLabel: string): any;
    createContainer(optionsArg: any, pullFirstArg?: boolean): any;
    getContainerId(): void;
    startContainer(containerNameArg: any): any;
    stopContainer(containerNameArg: any): any;
    removeContainer(containerNameArg: any): any;
    clean(): any;
    callOnChange(cb: Function): void;
    request(methodArg: string, routeArg: string, queryArg?: string, dataArg?: {}): any;
    requestStream(methodArg: any, routeArg: any, endArg?: boolean): any;
}
