// Vertex Object

module.exports = Vertex;

var Edge = require("./edge.js");

function Vertex (id)
{
    this.id = id;

    this.visited = false;
    this.connections = {};
}

Vertex.prototype.connect = function(vertexId)
{
    this.connections[vertexId] = new Edge(this.id, vertexId);
};
