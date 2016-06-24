
var Queue = require("../queue.js");

describe("Queue", function () {
    describe("enqueuing a new value", function () {
        it("makes both head and tail new value if first added", function () {
            var queue = new Queue();
            queue.enqueue("first");
            expect(queue.first()).toEqual("first");
            expect(queue.last()).toEqual("first");
        });
        it("get's added to end of queue", function () {
            var queue = new Queue();
            var arr = ["a", "b", "c", "d"];
            for (var i = 0; i < arr.length; i++) {
                queue.enqueue(arr[i]);
                expect(queue.first()).toEqual(arr[0]);
                expect(queue.last()).toEqual(arr[i]);
            }
        });
    });
    describe("dequeuing a value", function () {
        it("doesn't break if empty queue", function () {
            var queue = new Queue();
            var value = queue.dequeue();
            expect(value).toBe(null);
        });
        it("returns the first value put in", function () {
            var queue = new Queue();
            var arr = ["a", "b", "c", "d"];
            var i;
            for (i = 0; i < arr.length; i++) {
                queue.enqueue(arr[i]);
            }
            for (i = 0; i < arr.length; i++) {
                var value = queue.dequeue();
                expect(value).toEqual(arr[i]);
            }
        });
    });
});