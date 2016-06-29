// Graph Object

module.exports = Graph;

var Vertex = require("./vertex.js");
var Edge = require("./edge.js");
var Queue = require("./queue.js");

function Graph ()
{
    this._vertices = {};
}

Graph.prototype.vertex = function(id)
{
    return (this._vertices[id]) ? this._vertices[id] : null;
};

Graph.prototype.eachVertex = function (cb, args)
{
    if (!cb) {
        return;
    }
    args = args || {};
    for (var key in this._vertices) {
        if (args.unvisited && this.vertex(id).visited()) {
            continue;
        }
        cb(this.vertex(key));
    }
};

Graph.prototype.addVertex = function(id)
{
    if (this._vertices[id]) {
        return;
    }
    this._vertices[id] = new Vertex(id);
};

Graph.prototype.addEdge = function(from, to, args)
{
    args = args || {};
    if (!from || !to) {
        return;
    }
    if (!this._vertices[from]) {
        this.addVertex(from);
    }
    if (!this._vertices[to]) {
        this.addVertex(to);
    }
    this._vertices[from].connect(to);
    if (args.twoWay) {
        this._vertices[to].connect(from);
    }
};

Graph.prototype._unvisitAllVertices = function ()
{
    for (var id in this._vertices) {
        this.vertex(id).unvisit();
    }
};

Graph.prototype.allConnections = function (vertexId, args)
{
    args = args || {};
    this._unvisitAllVertices();
    var all = [];
    if (args.breadthFirst) {
        this._allConnectionsBreadthFirst(vertexId, all);
    } else {
        this._allConnections(vertexId, all);
    }
    return all;
};

Graph.prototype._allConnections = function (vertexId, all)
{
    var vertex = this.vertex(vertexId);
    if (!vertex) {
        return;
    }
    var self = this;
    vertex.eachNeighboringVertex(function (neighborId) {
        var neighbor = self.vertex(neighborId);
        if (neighbor.visited()) {
            return;
        }
        all.push(neighborId);
        neighbor.visit();
        self._allConnections(neighborId, all);
    });
};

Graph.prototype._allConnectionsBreadthFirst = function (vertexId, all)
{
    var queue = new Queue();
    var vertex = this.vertex(vertexId);
    var self = this;

    if (!vertex) {
        return;
    }
    queue.enqueue(vertex);

    while (queue.first()) {
        vertex = queue.dequeue();
        all.push(vertex.id());
        vertex.eachNeighboringVertex(enqueueNeighbor);
    }
    function enqueueNeighbor (neighborId) {
        var neighbor = self.vertex(neighborId);
        if (neighbor.visited()) {
            return;
        }
        queue.enqueue(neighbor);
        neighbor.visit();
    }
};

Graph.prototype.pathExists = function(vertexA, vertexB)  // Depth First Search
{
    this._unvisitAllVertices();
    return this._pathExists(vertexA, vertexB);
};

Graph.prototype._pathExists = function  (vertexA, vertexB)
{
    if (typeof vertexA === "undefined" || typeof vertexB === "undefined") {
        return false;
    }
    if (!this.vertex(vertexA) || !this.vertex(vertexB)) {
        return false;
    }
    var found = false;
    var self = this;
    this.vertex(vertexA).eachNeighboringVertex(function (neighborId) {
        if (found || self.vertex(neighborId).visited()) {
            return;
        }
        self.vertex(neighborId).visit();
        if (neighborId === vertexB || self._pathExists(neighborId, vertexB)) {
            found = true;
        }
    });
    return found;
};

Graph.prototype.distanceFromAToB = function (vertexA, vertexB)
{
    this._unvisitAllVertices();
    var vertex = this.vertex(vertexA);
    
    var queue = new Queue();
    var self = this;
    queue.enqueue({ distance: 0, vertex: vertex });

    while (!queue.empty()) {
        var obj = queue.dequeue();
        if (obj.vertex.id() === vertexB && obj.distance) {
            return obj.distance;
        }

        for (var key in obj.vertex.neighbors) {
            var neighbor = this.vertex(obj.vertex.neighbors[key].to());
            if (neighbor.visited()) {
                continue;
            }
            neighbor.visit();
            queue.enqueue({ distance: obj.distance + 1, vertex: neighbor });
        }
    }
    return -1;
};

Graph.prototype.size = function() {
    var count = 0;
    for (var id in this._vertices) {
        if (this._vertices.hasOwnProperty(id)) {
            count++;
        }
    }
    return count;
};

