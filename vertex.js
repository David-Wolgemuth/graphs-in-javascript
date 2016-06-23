// Vertex Object

function Vertex (id)
{
    this.id = id;

    this.visited = false;
    this.connections = {};
}

Vertex.prototype.connect = function(vertexId, weight)
{
    this.connections[vertexId] = new Edge(this.id, vertexId, weight);
};
