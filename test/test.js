"use strict";
require("typings-test");
require("should");
var index_1 = require("../dist/index");
describe("dockersock", function () {
    describe(".Dockersock()", function () {
        var testDockersock;
        it("should create a new Dockersock instance", function () {
            testDockersock = new index_1.Dockersock();
            testDockersock.should.be.instanceof(index_1.Dockersock);
        });
        it("should list containers", function (done) {
            testDockersock.listContainers()
                .then(function (dataArg) {
                console.log(dataArg);
                done();
            });
        });
        it("should list detailed containers", function (done) {
            this.timeout(5000);
            testDockersock.listContainersDetailed()
                .then(function (dataArg) {
                console.log(dataArg);
                done();
            });
        });
        it("should pull an image from imagetag", function (done) {
            this.timeout(10000);
            testDockersock.pullImage("nginx")
                .then(function (dataArg) {
                done();
            }, done);
        });
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQU8sY0FBYyxDQUFDLENBQUE7QUFDdEIsUUFBTyxRQUVQLENBQUMsQ0FGYztBQUVmLHNCQUF5QixlQUV6QixDQUFDLENBRnVDO0FBRXhDLFFBQVEsQ0FBQyxZQUFZLEVBQUM7SUFDbEIsUUFBUSxDQUFDLGVBQWUsRUFBQztRQUNyQixJQUFJLGNBQXlCLENBQUM7UUFDOUIsRUFBRSxDQUFDLHlDQUF5QyxFQUFDO1lBQ3pDLGNBQWMsR0FBRyxJQUFJLGtCQUFVLEVBQUUsQ0FBQztZQUNsQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsa0JBQVUsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLHdCQUF3QixFQUFDLFVBQVMsSUFBSTtZQUNyQyxjQUFjLENBQUMsY0FBYyxFQUFFO2lCQUMxQixJQUFJLENBQUMsVUFBQyxPQUFPO2dCQUNWLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztRQUNILEVBQUUsQ0FBQyxpQ0FBaUMsRUFBQyxVQUFTLElBQUk7WUFDOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNuQixjQUFjLENBQUMsc0JBQXNCLEVBQUU7aUJBQ2xDLElBQUksQ0FBQyxVQUFDLE9BQU87Z0JBQ1YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDckIsSUFBSSxFQUFFLENBQUM7WUFDWCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ0gsRUFBRSxDQUFDLG9DQUFvQyxFQUFDLFVBQVMsSUFBSTtZQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLGNBQWMsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2lCQUM1QixJQUFJLENBQUMsVUFBQyxPQUFPO2dCQUNWLElBQUksRUFBRSxDQUFDO1lBQ1gsQ0FBQyxFQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hCLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwidHlwaW5ncy10ZXN0XCI7XG5pbXBvcnQgXCJzaG91bGRcIlxuXG5pbXBvcnQge0RvY2tlcnNvY2t9IGZyb20gXCIuLi9kaXN0L2luZGV4XCJcblxuZGVzY3JpYmUoXCJkb2NrZXJzb2NrXCIsZnVuY3Rpb24oKXtcbiAgICBkZXNjcmliZShcIi5Eb2NrZXJzb2NrKClcIixmdW5jdGlvbigpe1xuICAgICAgICBsZXQgdGVzdERvY2tlcnNvY2s6RG9ja2Vyc29jaztcbiAgICAgICAgaXQoXCJzaG91bGQgY3JlYXRlIGEgbmV3IERvY2tlcnNvY2sgaW5zdGFuY2VcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGVzdERvY2tlcnNvY2sgPSBuZXcgRG9ja2Vyc29jaygpO1xuICAgICAgICAgICAgdGVzdERvY2tlcnNvY2suc2hvdWxkLmJlLmluc3RhbmNlb2YoRG9ja2Vyc29jayk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdChcInNob3VsZCBsaXN0IGNvbnRhaW5lcnNcIixmdW5jdGlvbihkb25lKXtcbiAgICAgICAgICAgIHRlc3REb2NrZXJzb2NrLmxpc3RDb250YWluZXJzKClcbiAgICAgICAgICAgICAgICAudGhlbigoZGF0YUFyZyk9PntcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YUFyZyk7XG4gICAgICAgICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KFwic2hvdWxkIGxpc3QgZGV0YWlsZWQgY29udGFpbmVyc1wiLGZ1bmN0aW9uKGRvbmUpe1xuICAgICAgICAgICAgdGhpcy50aW1lb3V0KDUwMDApO1xuICAgICAgICAgICAgdGVzdERvY2tlcnNvY2subGlzdENvbnRhaW5lcnNEZXRhaWxlZCgpXG4gICAgICAgICAgICAgICAgLnRoZW4oKGRhdGFBcmcpPT57XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGFBcmcpO1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBpdChcInNob3VsZCBwdWxsIGFuIGltYWdlIGZyb20gaW1hZ2V0YWdcIixmdW5jdGlvbihkb25lKXtcbiAgICAgICAgICAgIHRoaXMudGltZW91dCgxMDAwMCk7XG4gICAgICAgICAgICB0ZXN0RG9ja2Vyc29jay5wdWxsSW1hZ2UoXCJuZ2lueFwiKVxuICAgICAgICAgICAgICAgIC50aGVuKChkYXRhQXJnKT0+e1xuICAgICAgICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICAgICAgfSxkb25lKTtcbiAgICAgICAgfSlcbiAgICB9KTtcbn0pOyJdfQ==
