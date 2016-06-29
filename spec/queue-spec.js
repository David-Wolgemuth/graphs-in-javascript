
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
        it("increases the size by one", function () {
            queue = new Queue();
            for (var size = 1; size < 12; size++) {
                queue.enqueue(size);
                expect(queue.size()).toEqual(size);
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
        it("decreases the size by 1", function () {
            var queue = new Queue();
            for (var size = 0; size < 24; size++) {
                queue.enqueue("something");
            }
            var prev = queue.size();
            expect(prev).toEqual(24)
            while (prev > 0) {
                queue.dequeue();
                expect(queue.size()).toEqual(prev - 1);
                prev = queue.size();
            }
        });
    });
});