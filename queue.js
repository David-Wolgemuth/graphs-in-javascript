
module.exports = Queue;

function Queue ()
{
    this._head = null;
    this._tail = null;
    this._size = 0;
}

Queue.prototype.size = function()
{
    return this._size;
};
Queue.prototype.empty = function()
{
    return !this._head;
};

Queue.prototype.first = function()
{
    if (this.empty()) {
        return null;
    }
    return this._head.value;
};

Queue.prototype.last = function()
{
    if (!this._tail) {
        return null;
    }
    return this._tail.value;
};

Queue.prototype.enqueue = function(value)
{
    var node = new QNode(value);
    if (!this._head) {
        this._head = node;
    }
    if (this._tail) {
        this._tail.next = node;
    }
    this._tail = node;
    this._size++;
};

Queue.prototype.dequeue = function()
{
    if (!this._head) {
        return null;
    }
    var value = this._head.value;
    if (this._head === this._tail) {
        this._head = null;
        this._tail = null;
    } else {
        this._head = this._head.next;
    }
    this._size--;
    return value;
};

function QNode (value)
{
    this.value = value;
    this.next = null;
}