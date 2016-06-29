
var Graph = require("../graph.js");
var Edge = require("../edge.js");
var Vertex = require("../vertex.js");

describe("Graph", function () {
    
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

    describe("`.allConnections(vertex)` method", function () {
        var graph = testGraphBasedOnImageA();

        var notConnectedToA = ["A", "T", "M"];  // No Circular Connections?
        var connectedToP = ["P", "N", "O", "Q"];

        var aConnections = graph.allConnections("A");
        var pConnections = graph.allConnections("P");

        it("contains all connections including adjacent / distant / through loops / self-connections", function () {
            for (var id in graph.vertices) {
                if (notConnectedToA.indexOf(id) < 0) {
                    expect(aConnections.indexOf(id)).not.toBeLessThan(0, id);
                }
                if (connectedToP.indexOf(id) >= 0) {
                    expect(pConnections.indexOf(id)).not.toBeLessThan(0, id);
                }
            }
            expect(graph.allConnections("H")).toEqual(["H"]);
        });
        it("ignores vertices that are not connected and origin, unless connected", function () {
            for (var id in graph.vertices) {
                if (connectedToP.indexOf(id) < 0) {
                    expect(pConnections.indexOf(id)).toBeLessThan(0, id);
                }
                if (notConnectedToA.indexOf(id) >= 0) {
                    expect(aConnections.indexOf(id)).toBeLessThan(0, id);
                }
            }
        });

        describe("`.allConnections(vertex, args)` where arg 'breadthFirst' is true", function () {
            it("adds vertexes row by row as they radiate from origin", function () {
                var rows = [
                    ["A"],
                    ["B", "C", "D"],
                    ["E", "G", "H"],
                    ["I", "J", "F", "K"],
                    ["N", "R"],
                    ["P", "O", "S"],
                    ["Q", "L"]
                ];
                var conns = graph.allConnections("A", { breadthFirst: true });
                var r = 0;
                while (conns.length && rows.length) {
                    var c = conns.shift();
                    var idx = rows[r].indexOf(c);
                    expect(idx).not.toBeLessThan(0, [c, idx, rows[r]]);
                    rows[r].splice(idx, 1);
                    if (!rows[r].length) {
                        rows.shift();
                    }
                }
            });
        });
    });

    describe("`.pathExists(vertexA, vertexB)` method", function () {
        var graph = testGraphBasedOnImageA();

        it("returns true for adjacent vertices", function () {
            expect(graph.pathExists("A", "B")).toBe(true, "A -> B");
            expect(graph.pathExists("J", "N")).toBe(true, "J -> N");
            expect(graph.pathExists("L", "K")).toBe(true, "L -> K");
        });

        it("returns false for unconnected vertices", function () {
            expect(graph.pathExists("A", "M")).toBe(false, "A -> M");
            expect(graph.pathExists("L", "A")).toBe(false, "L -> A");
            expect(graph.pathExists("B", "A")).toBe(false, "B -> A");
            expect(graph.pathExists("J", "M")).toBe(false, "J -> M");
        });

        it("returns true for edges requiring multilple steps", function () {
            expect(graph.pathExists("A", "Q")).toBe(true, "A -> Q");
            expect(graph.pathExists("G", "P")).toBe(true, "G -> P");
            expect(graph.pathExists("M", "O")).toBe(true, "M -> O");
            expect(graph.pathExists("I", "P")).toBe(true, "I -> P");
        });

        it("returns true if edges form a loop back to origin or self-connected nodes `pathExists(a, a)`", function () {
            expect(graph.pathExists("N", "N")).toBe(true, "N -> N");
            expect(graph.pathExists("L", "L")).toBe(true, "L -> L");
            expect(graph.pathExists("H", "H")).toBe(true, "H -> H"); // Why isn't this breaking?
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
}

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
    graph.addEdge("B", "G", { twoWay: true });

    // C
    graph.addEdge("C", "H");

    // H
    graph.addEdge("H", "H");

    // E
    graph.addEdge("E", "I", { twoWay: true }); 
    graph.addEdge("E", "J");

    // G
    graph.addEdge("G", "F");
    graph.addEdge("G", "K");

    // F
    graph.addEdge("F", "K");

    // K
    graph.addEdge("K", "R");

    // R
    graph.addEdge("R", "S", { twoWay: true });

    // S
    graph.addEdge("S", "L");

    // T
    graph.addEdge("T", "L");

    // L
    graph.addEdge("L", "K");

    // J
    graph.addEdge("J", "N");

    // M
    graph.addEdge("M", "I");
    graph.addEdge("M", "J");

    // N
    graph.addEdge("N", "P", { twoWay: true });
    graph.addEdge("N", "O");

    // P
    graph.addEdge("P", "O");

    // O
    graph.addEdge("O", "Q");

    return graph;
}
