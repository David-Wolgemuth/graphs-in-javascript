// Vertex Object

module.exports = Vertex;

var Edge = require("./edge.js");

function Vertex (id)
{
    this._id = id;
    this.neighbors = {};
    this._visited = false;
}
Vertex.prototype.id = function(id)
{
    return this._id;
};
Vertex.prototype.is = function(id)
{
    return (id === this._id);
};
Vertex.prototype.visit = function ()
{
    this._visited = true;
};
Vertex.prototype.unvisit = function ()
{
    this._visited = false;
};
Vertex.prototype.visited = function ()
{
    return this._visited;
};

Vertex.prototype.eachNeighboringVertex = function(cb, args)
{
    if (typeof cb !== "function") {
        return;
    }
    args = args || {};
    for (var key in this.neighbors) {
        cb(this.neighbors[key].to());
    }
};
Vertex.prototype.edge = function (vertexId)
{
    return (this.neighbors[vertexId]) ? this.neighbors[vertexId] : null;
};
Vertex.prototype.connect = function(vertexId)
{
    if (this.neighbors[vertexId]) {
        return;
    }
    this.neighbors[vertexId] = new Edge(this.id, vertexId);
};
