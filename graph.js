// Graph Object

module.exports = Graph;

var Vertex = require("./vertex.js");
var Edge = require("./edge.js");

function Graph ()
{
    this.vertices = {};
}

Graph.prototype.vertex = function(id)
{
    return (this.vertices[id]) ? this.vertices[id] : null;
};
Graph.prototype.addVertex = function(id)
{
    if (this.vertices[id]) {
        return;
    }
    this.vertices[id] = new Vertex(id);
};

Graph.prototype.addEdge = function(from, to, twoWay)
{
    if (!from || !to) {
        return;
    }
    if (!this.vertices[from]) {
        this.addVertex(from);
    }
    if (!this.vertices[to]) {
        this.addVertex(to);
    }
    this.vertices[from].connect(to);
    if (twoWay) {
        this.vertices[to].connect(from);
    }
};

Graph.prototype.resetVisited = function ()
{
    for (var id in this.vertices) {
        this.vertices[id].visited = false;
    }    
};

Graph.prototype.allConnections = function (vertex)  // Depth First Search
{
    this.resetVisited();
    var vertices = [];
    this._allConnections(vertex, vertices);
    return vertices;
};

Graph.prototype._allConnections = function (vertex, vertices)
{
    if (!vertex || !this.vertices[vertex]) {
        return;
    }
    var edges = this.vertices[vertex].connections;
    for (var key in edges) {
        var to = edges[key].to;
        if (this.vertices[to].visited) {
            continue;
        }
        vertices.push(to);
        this.vertices[to].visited = true;
        this._allConnections(to, vertices);
    }
};

Graph.prototype.pathExists = function(vertexA, vertexB)  // Depth First Search
{
    this.resetVisited();
    return this._pathExists(vertexA, vertexB);
};

Graph.prototype._pathExists = function  (vertexA, vertexB)
{
    if (!vertexA || !vertexB) {
        return false;
    }
    if (!this.vertices[vertexA] || !this.vertices[vertexB]) {
        return false;
    }
    var edges = this.vertices[vertexA].connections;
    for (var key in edges) {
        var to = edges[key].to;
        if (this.vertices[to].visited) {
            continue;
        }
        this.vertices[to].visited = true;
        if (to === vertexB || this._pathExists(to, vertexB)) {
            return true;
        }
    }
    return false;
};

Graph.prototype.size = function() {
    var count = 0;
    for (var id in this.vertices) {
        if (this.vertices.hasOwnProperty(id)) {
            count++;
        }
    }
    return count;
};
