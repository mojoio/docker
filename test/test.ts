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
        it("should list containers",function(done){
            testDockersock.listContainers()
                .then((dataArg)=>{
                    console.log(dataArg);
                    done();
                });
        });
        it("should list detailed containers",function(done){
            this.timeout(5000);
            testDockersock.listContainersDetailed()
                .then((dataArg)=>{
                    console.log(dataArg);
                    done();
                });
        });
        it("should pull an image from imagetag",function(done){
            this.timeout(30000);
            testDockersock.pullImage("hosttoday%2Fht-docker-dbase")
                .then((dataArg)=>{
                    done();
                },done);
        })
    });
});