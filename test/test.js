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
            testDockersock.pullImage("hosttoday/ht-docker-dbase")
                .then((dataArg) => {
                done();
            });
        });
        it("should return a change Objservable", function (done) {
            this.timeout(10000);
            testDockersock.getChangeObservable();
            testDockersock.endRequests();
            done();
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQU8sY0FBYyxDQUFDLENBQUE7QUFDdEIsUUFBTyxRQUFRLENBQUMsQ0FBQTtBQUVoQix3QkFBMkIsZUFBZSxDQUFDLENBQUE7QUFFM0MsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUNuQixRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3RCLElBQUksY0FBMEIsQ0FBQztRQUMvQixFQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDMUMsY0FBYyxHQUFHLElBQUksa0JBQVUsRUFBRSxDQUFDO1lBQ2xDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxrQkFBVSxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsd0JBQXdCLEVBQUUsVUFBVSxJQUFJO1lBQ3ZDLGNBQWMsQ0FBQyxjQUFjLEVBQUU7aUJBQzFCLElBQUksQ0FBQyxDQUFDLE9BQU87Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckIsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLFVBQVUsSUFBSTtZQUNoRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ25CLGNBQWMsQ0FBQyxzQkFBc0IsRUFBRTtpQkFDbEMsSUFBSSxDQUFDLENBQUMsT0FBTztnQkFDVixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQixJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsb0NBQW9DLEVBQUUsVUFBVSxJQUFJO1lBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsY0FBYyxDQUFDLFNBQVMsQ0FBQywyQkFBMkIsQ0FBQztpQkFDaEQsSUFBSSxDQUFDLENBQUMsT0FBTztnQkFDVixJQUFJLEVBQUUsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsb0NBQW9DLEVBQUUsVUFBVSxJQUFJO1lBQ25ELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEIsY0FBYyxDQUFDLG1CQUFtQixFQUFFLENBQUM7WUFDckMsY0FBYyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzdCLElBQUksRUFBRSxDQUFDO1FBQ1gsQ0FBQyxDQUFDLENBQUE7SUFDTixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFDIn0=