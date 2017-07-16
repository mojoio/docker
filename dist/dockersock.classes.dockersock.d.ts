/// <reference types="q" />
import "typings-global";
import * as plugins from "./dockersock.plugins";
import { Observable } from "rxjs";
import { Objectmap } from 'lik';
export declare class Dockersock {
    sockPath: string;
    requestObjectmap: Objectmap<any>;
    constructor(pathArg?: string);
    auth(userArg: string, passArg: string): plugins.q.Promise<{}>;
    listContainers(): plugins.q.Promise<{}>;
    listContainersDetailed(): plugins.q.Promise<{}>;
    listContainersRunning(): plugins.q.Promise<{}>;
    listContainersStopped(): plugins.q.Promise<{}>;
    listImages(): plugins.q.Promise<{}>;
    listImagesDangling(): plugins.q.Promise<{}>;
    pullImage(imageLabelArg: string): plugins.q.Promise<{}>;
    createContainer(optionsArg: any, pullFirstArg?: boolean): plugins.q.Promise<{}>;
    getContainerId(): void;
    startContainer(containerNameArg: any): plugins.q.Promise<{}>;
    stopContainer(containerNameArg: any): plugins.q.Promise<{}>;
    removeContainer(containerNameArg: any): plugins.q.Promise<{}>;
    clean(): plugins.q.Promise<{}>;
    callOnChange(cb: Function): void;
    /**
     * gets you an observable that reports changes in the docker infrastructure
     */
    getChangeObservable(): Observable<{}>;
    /**
     * fire a request
     * @param methodArg
     * @param routeArg
     * @param queryArg
     * @param dataArg
     */
    request(methodArg: string, routeArg: string, queryArg?: string, dataArg?: {}): plugins.q.Promise<{}>;
    /**
     * fire a streaming request
     * @param methodArg
     * @param routeArg
     * @param queryArg
     * @param dataArg
     */
    requestStream(methodArg: string, routeArg: string, queryArg?: string, dataArg?: {}): plugins.q.Promise<{}>;
    /**
     * end all currently streaming requests
     */
    endRequests(): void;
}
