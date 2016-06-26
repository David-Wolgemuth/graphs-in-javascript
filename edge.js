// Edge Object

module.exports = Edge;

function Edge (from, to, weight)
{
    this._from = from;
    this._to = to;
    this._weight = (typeof weight === "undefined") ? null : weight;
}
Edge.prototype.weight = function (weight)
{
    if (typeof weight !== "undefined") {
        this._weight = weight;
    }
    return this._weight;
};
Edge.prototype.from = function ()
{
    return this._from;
};
Edge.prototype.to = function ()
{
    return this._to;
};
