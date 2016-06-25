// Vertex Object

module.exports = Vertex;

var Edge = require("./edge.js");

function Vertex (id)
{
    this._id = id;
    this._edges = {};

    this.visited = false;
}
Vertex.prototype.edge = function (vertexId)
{
    return (this._edges[vertexId]) ? this._edges[vertexId] : null;
};
Vertex.prototype.connect = function(vertexId)
{
    if (this._edges[vertexId]) {
        return;
    }
    this._edges[vertexId] = new Edge(this.id, vertexId);
};
