// Edge Object

module.exports = Edge;

function Edge (from, to)
{
    this._from = from;
    this._to = to;
}
Edge.prototype.from = function ()
{
    return this._from;
};
Edge.prototype.to = function ()
{
    return this._to;
};
