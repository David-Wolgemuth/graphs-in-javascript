function Graph ()
{
    this.vertices = [];
    this.edges = [];
}

Graph.prototype.addVertex = function(value)
{
    var vertex = new Vertex(value);
    this.vertices.push(vertex);
};