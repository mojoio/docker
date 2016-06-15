import "typings-global";
export declare class dockersock {
    sockPath: string;
    constructor(pathArg: string);
    request(methodArg: string, routeArg: string, dataArg?: {}): any;
}
