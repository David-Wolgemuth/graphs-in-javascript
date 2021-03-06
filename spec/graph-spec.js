
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

    describe("`.distanceFromAToB(vertexA, vertexB)` method", function () {
        var graph = testGraphBasedOnImageA();
        it("returns `-1` if no path exists", function () {
            expect(graph.distanceFromAToB("A", "M")).toEqual(-1);
            expect(graph.distanceFromAToB("K", "T")).toEqual(-1);
        });
        it("returns smallest path distance", function () {
            expect(graph.distanceFromAToB("A", "C")).toEqual(1);
            expect(graph.distanceFromAToB("A", "H")).toEqual(2);
            expect(graph.distanceFromAToB("B", "I")).toEqual(2);
            expect(graph.distanceFromAToB("A", "Q")).toEqual(6);
            expect(graph.distanceFromAToB("S", "R")).toEqual(1);
            expect(graph.distanceFromAToB("F", "L")).toEqual(4);
        });
        it("returns `-1` if the start and end are the same, unless there's a path", function () {
            expect(graph.distanceFromAToB("H", "H")).toEqual(1);
            expect(graph.distanceFromAToB("S", "S")).toEqual(2);
            expect(graph.distanceFromAToB("K", "K")).toEqual(4);
            expect(graph.distanceFromAToB("C", "C")).toEqual(-1);
            expect(graph.distanceFromAToB("J", "J")).toEqual(-1);
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

    describe("pathFromAToB", function () {
        var graph = testGraphBasedOnImageA();
        it("returns `null` if no path exists", function () {
            expect(graph.pathFromAToB("A", "A")).toBe(null);
            expect(graph.pathFromAToB("A", "T")).toBe(null);
            expect(graph.pathFromAToB("G", "H")).toBe(null);
            expect(graph.pathFromAToB("Not", "H")).toBe(null);
            expect(graph.pathFromAToB("A", "A Key")).toBe(null);
        });
        it("returns an array of keys showing the shortest path", function () {
            var paths = [{
                start: "A", end: "H", expected: ["C", "H"]
            }, {
                start: "G", end: "S", expected: ["K", "R", "S"]
            }, {
                start: "H", end: "H", expected: ["H"]
            }, {
                start: "I", end: "O", expected: ["E", "J", "N", "O"]
            }, {
                start: "A", end: "Q", expected: ["B", "E", "J", "N", "O", "Q"]
            }];
            for (var p = 0; p < paths.length; p++) {
                var pathA = paths[p].expected;
                var pathB = graph.pathFromAToB(paths[p].start, paths[p].end);
                expect(pathA.length).toEqual(pathB.length, pathA, pathB);
                for (var i = 0; i < pathA.length; i++) {
                    expect(pathA[i]).toEqual(pathB[i], i, pathA, pathB);
                }
            }
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
