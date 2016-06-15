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
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLFFBQU8sY0FBYyxDQUFDLENBQUE7QUFDdEIsUUFBTyxRQUVQLENBQUMsQ0FGYztBQUVmLHNCQUF5QixlQUV6QixDQUFDLENBRnVDO0FBRXhDLFFBQVEsQ0FBQyxZQUFZLEVBQUM7SUFDbEIsUUFBUSxDQUFDLGVBQWUsRUFBQztRQUNyQixJQUFJLGNBQXlCLENBQUM7UUFDOUIsRUFBRSxDQUFDLHlDQUF5QyxFQUFDO1lBQ3pDLGNBQWMsR0FBRyxJQUFJLGtCQUFVLEVBQUUsQ0FBQztZQUNsQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsa0JBQVUsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJ0ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwidHlwaW5ncy10ZXN0XCI7XG5pbXBvcnQgXCJzaG91bGRcIlxuXG5pbXBvcnQge0RvY2tlcnNvY2t9IGZyb20gXCIuLi9kaXN0L2luZGV4XCJcblxuZGVzY3JpYmUoXCJkb2NrZXJzb2NrXCIsZnVuY3Rpb24oKXtcbiAgICBkZXNjcmliZShcIi5Eb2NrZXJzb2NrKClcIixmdW5jdGlvbigpe1xuICAgICAgICBsZXQgdGVzdERvY2tlcnNvY2s6RG9ja2Vyc29jaztcbiAgICAgICAgaXQoXCJzaG91bGQgY3JlYXRlIGEgbmV3IERvY2tlcnNvY2sgaW5zdGFuY2VcIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGVzdERvY2tlcnNvY2sgPSBuZXcgRG9ja2Vyc29jaygpO1xuICAgICAgICAgICAgdGVzdERvY2tlcnNvY2suc2hvdWxkLmJlLmluc3RhbmNlb2YoRG9ja2Vyc29jayk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7Il19
