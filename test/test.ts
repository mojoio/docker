import "typings-test";
import "should"

import {Dockersock} from "../dist/index"

describe("dockersock",function(){
    describe(".Dockersock()",function(){
        let testDockersock:Dockersock;
        it("should create a new Dockersock instance",function(){
            testDockersock = new Dockersock();
            testDockersock.should.be.instanceof(Dockersock);
        });
    });
});