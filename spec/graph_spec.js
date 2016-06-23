
var Graph = require("../graph.js");
var Edge = require("../edge.js");
var Vertex = require("../vertex.js");

describe("Instantiating Graph", function () {
    var graph = new Graph();
    it("has a vertices list", function () {
        expect(typeof graph.vertices).not.toEqual("undefined");
    });
    it("keeps can get count of vertices with `.size()`", function () {
        expect(graph.size()).toEqual(0);
    });
});

function newTestingGraph(count) {
    var graph = new Graph();
    for (var i = 0; i < count; i++) {
        graph.addVertex("vertex-" + i);
    }
    return graph;
}
describe("Adding a vertex with `.addVertex()`", function () {
    var count = 6; 
    var graph = newTestingGraph(count);

    it("changes the number of vertices", function () {
        expect(graph.size()).toEqual(count);
    });

    it("ignores duplicate vertices", function () {
        var sizeBefore = graph.size();
        for (var key in graph.vertices) {
            graph.addVertex(key);
        }
        expect(graph.size()).toEqual(sizeBefore);
    });
});

describe("connecting vertices with `.addEdge()`", function () {
    var graph = newTestingGraph(12);
    it("creates new vertices if keys don't exist", function () {
        var sizeBefore = graph.size();
        graph.addEdge("x", "y");
        expect(graph.size()).toEqual(sizeBefore + 2);
    });
    it("allows access from 'from' to 'to' via `vertex.connections`", function () {
        graph.addEdge("a", "b");
        var edge = graph.vertices["a"].connections["b"];
        expect(edge).toEqual(jasmine.any(Edge));
        expect(edge.from).toEqual("a");
        expect(edge.to).toEqual("b");
    });
    it("allows access from 'to' to 'from' if twoWay connection", function () {
        graph.addEdge("two", "way", 0, true);  // Final param is `twoWay`
        var edge = graph.vertices["way"].connections["two"];
        expect(edge).toEqual(jasmine.any(Edge));
        expect(edge.from).toEqual("way");
        expect(edge.to).toEqual("two");
    });
});

describe("`.pathExistsBetweenVertices(vertexA, vertexB)` method", function () {
    var graph = new Graph();
    graph.addEdge("a", "b");
    graph.addEdge("a", "c");
    graph.addEdge("b", "d");
    graph.addEdge("c", "e");
    graph.addEdge("f", "d");  // Shouldn't work in reverse
    graph.addEdge("g", "c");  // Shouldn't work in reverse

    // Long train from a
    graph.addEdge("a", "x");
    graph.addEdge("x", "y");
    graph.addEdge("y", "z");  // should connect a >>> z
    graph.addEdge("zz", "a");  // should connect zz >>> z

    graph.addEdge("z", "zz"); // creates loop?

    it("returns true for adjacent vertices", function () {
        expect(graph.pathExistsBetweenVertices("a", "b"));
        expect(graph.pathExistsBetweenVertices("a", "c"));
    });

    it("returns false for unconnected vertices", function () {
        expect(graph.pathExistsBetweenVertices("b", "x")).toBe(false);
        expect(graph.pathExistsBetweenVertices("zz", "g")).toBe(false);
    });

    it("returns true for edges requiring multilple steps", function () {
        expect(graph.pathExistsBetweenVertices("a", "c"));
        expect(graph.pathExistsBetweenVertices("a", "e"));
        expect(graph.pathExistsBetweenVertices("a", "z"));
        expect(graph.pathExistsBetweenVertices("zz", "z"));
    });

    it("returns true if edges form a loop back to origin `pathExistsBetweenVertices(a, a)`", function () {
        expect(graph.pathExistsBetweenVertices("a", "a"));
        expect(graph.pathExistsBetweenVertices("x", "x"));
        expect(graph.pathExistsBetweenVertices("z", "z"));
        expect(graph.pathExistsBetweenVertices("zz", "zz"));
    });

    it("returns false if oneWay connection doesn't allow traversal", function () {
        expect(graph.pathExistsBetweenVertices("c", "g")).toBe(false);
        expect(graph.pathExistsBetweenVertices("g", "a")).toBe(false);
        expect(graph.pathExistsBetweenVertices("not", "there")).toBe(false);
    });
});
