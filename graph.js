// Graph Object

module.exports = Graph;

var Vertex = require("./vertex.js");
var Edge = require("./edge.js");

function Graph ()
{
    this.vertices = {};
}

Graph.prototype.addVertex = function(id)
{
    if (this.vertices[id]) {
        return;
    }
    this.vertices[id] = new Vertex(id);
};

Graph.prototype.addEdge = function(from, to, weight, twoWay)
{
    if (from === to || !from || !to) {
        return;
    }
    if (!this.vertices[from]) {
        this.addVertex(from);
    }
    if (!this.vertices[to]) {
        this.addVertex(to);
    }
    this.vertices[from].connect(to, weight);
    if (twoWay) {
        this.vertices[to].connect(from, weight);
    }
};

Graph.prototype.resetVisited = function()
{
    for (var id in this.vertices) {
        this.vertices[id].visited = false;
    }    
};

Graph.prototype.pathExistsBetweenVertices = function(vertexA, vertexB)  // Depth First Search
{
    this.resetVisited();
    var self = this;
    return pathExistsBetweenVertices(vertexA, vertexB);
    function pathExistsBetweenVertices (vertexA, vertexB)
    {
        if (!vertexA || !vertexB) {
            return false;
        }
        if (!self.vertices[vertexA] || !self.vertices[vertexB]) {
            return false;
        }
        var edges = self.vertices[vertexA].connections;
        for (var key in edges) {
            var to = edges[key].to;
            if (self.vertices[to].visited) {
                continue;
            }
            self.vertices[to].visited = true;
            if (to === vertexB || pathExistsBetweenVertices(to, vertexB)) {
                return true;
            }
        }
        return false;
    }
};

Graph.prototype.size = function() {
    var count = 0;
    for (id in this.vertices) {
        if (this.vertices.hasOwnProperty(id)) {
            count++;
        }
    }
    return count;
};
