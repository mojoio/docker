"use strict";
require("typings-test");
require("should");
const index_1 = require("../dist/index");
describe("dockersock", function () {
    describe(".Dockersock()", function () {
        let testDockersock;
        it("should create a new Dockersock instance", function () {
            testDockersock = new index_1.Dockersock();
            testDockersock.should.be.instanceof(index_1.Dockersock);
        });
        it("should list containers", function (done) {
            testDockersock.listContainers()
                .then((dataArg) => {
                console.log(dataArg);
                done();
            });
        });
        it("should list detailed containers", function (done) {
            this.timeout(5000);
            testDockersock.listContainersDetailed()
                .then((dataArg) => {
                console.log(dataArg);
                done();
            });
        });
        it("should pull an image from imagetag", function (done) {
            this.timeout(60000);
            testDockersock.pullImage("hosttoday%2Fht-docker-dbase")
                .then((dataArg) => {
                done();
            }, done);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQU8sY0FBYyxDQUFDLENBQUE7QUFDdEIsUUFBTyxRQUFRLENBQUMsQ0FBQTtBQUVoQix3QkFBeUIsZUFFekIsQ0FBQyxDQUZ1QztBQUV4QyxRQUFRLENBQUMsWUFBWSxFQUFDO0lBQ2xCLFFBQVEsQ0FBQyxlQUFlLEVBQUM7UUFDckIsSUFBSSxjQUF5QixDQUFDO1FBQzlCLEVBQUUsQ0FBQyx5Q0FBeUMsRUFBQztZQUN6QyxjQUFjLEdBQUcsSUFBSSxrQkFBVSxFQUFFLENBQUM7WUFDbEMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLGtCQUFVLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyx3QkFBd0IsRUFBQyxVQUFTLElBQUk7WUFDckMsY0FBYyxDQUFDLGNBQWMsRUFBRTtpQkFDMUIsSUFBSSxDQUFDLENBQUMsT0FBTztnQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQixJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsaUNBQWlDLEVBQUMsVUFBUyxJQUFJO1lBQzlDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkIsY0FBYyxDQUFDLHNCQUFzQixFQUFFO2lCQUNsQyxJQUFJLENBQUMsQ0FBQyxPQUFPO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBQyxVQUFTLElBQUk7WUFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQixjQUFjLENBQUMsU0FBUyxDQUFDLDZCQUE2QixDQUFDO2lCQUNsRCxJQUFJLENBQUMsQ0FBQyxPQUFPO2dCQUNWLElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9