
var Graph = require("../graph.js");
var Edge = require("../edge.js");
var Vertex = require("../vertex.js");

describe("Graph", function () {

    describe("Instantiating", function () {
        var graph = new Graph();
        it("has a vertices list", function () {
            expect(typeof graph.vertices).not.toEqual("undefined");
        });
        it("keeps can get count of vertices with `.size()`", function () {
            expect(graph.size()).toEqual(0);
        });
    });

    
    describe("Adding a vertex with `.addVertex()`", function () {
        var count = 6; 
        var graph = testGraphInWithXNodes(count);

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
        var graph = testGraphInWithXNodes(12);
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
            graph.addEdge("two", "way", true);  // Final param is `twoWay`
            var edge = graph.vertices["way"].connections["two"];
            expect(edge).toEqual(jasmine.any(Edge));
            expect(edge.from).toEqual("way");
            expect(edge.to).toEqual("two");
        });
    });

    describe("`.pathExistsBetweenVertices(vertexA, vertexB)` method", function () {
        var graph = testGraphBasedOnImageA();

        it("returns true for adjacent vertices", function () {
            expect(graph.pathExistsBetweenVertices("A", "B"));
            expect(graph.pathExistsBetweenVertices("J", "N"));
            expect(graph.pathExistsBetweenVertices("L", "K"));
        });

        it("returns false for unconnected vertices", function () {
            expect(graph.pathExistsBetweenVertices("A", "M")).toBe(false);
            expect(graph.pathExistsBetweenVertices("L", "A")).toBe(false);
            expect(graph.pathExistsBetweenVertices("B", "A")).toBe(false);
            expect(graph.pathExistsBetweenVertices("J", "M")).toBe(false);
        });

        it("returns true for edges requiring multilple steps", function () {
            expect(graph.pathExistsBetweenVertices("A", "Q"));
            expect(graph.pathExistsBetweenVertices("G", "P"));
            expect(graph.pathExistsBetweenVertices("M", "O"));
            expect(graph.pathExistsBetweenVertices("I", "P"));
        });

        it("returns true if edges form a loop back to origin `pathExistsBetweenVertices(a, a)`", function () {
            expect(graph.pathExistsBetweenVertices("N", "N"));
            expect(graph.pathExistsBetweenVertices("L", "L"));
        });
    });

});


function testGraphInWithXNodes (count)
{
    var graph = new Graph();
    for (var i = 0; i < count; i++) {
        graph.addVertex("vertex-" + i);
    }
    return graph; 
};

function testGraphBasedOnImageA ()
{
    // See example-image-a.pdf
    var graph = new Graph();
    // A
    graph.addEdge("A", "B");
    graph.addEdge("A", "C");
    graph.addEdge("A", "D");

    // B
    graph.addEdge("B", "E");
    graph.addEdge("B", "G", true);

    // C
    graph.addEdge("C", "H");

    // E
    graph.addEdge("E", "I", true); 
    graph.addEdge("E", "J");

    // G
    graph.addEdge("G", "F");
    graph.addEdge("G", "K");

    // F
    graph.addEdge("F", "K");

    // L
    graph.addEdge("L", "K");

    // J
    graph.addEdge("J", "N");

    // M
    graph.addEdge("M", "I");
    graph.addEdge("M", "J");

    // N
    graph.addEdge("N", "P", true);
    graph.addEdge("N", "O");

    // P
    graph.addEdge("P", "O");

    // O
    graph.addEdge("O", "Q");
    
    return graph;
};
