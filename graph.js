// Graph Object

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
    for (var id in vertices) {
        vertices[id].visited = false;
    }    
};

Graph.prototype.areConnected = function(vertexA, vertextB)
{
    this.resetVisited();
    if (!vertexA || !vertextB) {
        return false;
    }
    var connected = false;
    for (var id in this.vertices[vertexA]) {
        if (this.vertices[id].visited) {
            continue;
        }
        this.vertices[id].visited = true;
        if (this.areConnected(id, vertextB)) {
            connected = true;
            break;
        }
    }
    return connected;
};
