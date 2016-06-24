
module.exports = Queue;

function Queue ()
{
    this.head = null;
    this.tail = null;
}

Queue.prototype.first = function()
{
    if (!this.head) {
        return null;
    }
    return this.head.value;
};

Queue.prototype.last = function()
{
    if (!this.tail) {
        return null;
    }
    return this.tail.value;
};

Queue.prototype.enqueue = function(value)
{
    var node = new QNode(value);
    if (!this.head) {
        this.head = node;
    }
    if (this.tail) {
        this.tail.next = node;
    }
    this.tail = node;
};

Queue.prototype.dequeue = function()
{
    if (!this.head) {
        return null;
    }
    var value = this.head.value;
    if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
    } else {
        this.head = this.head.next;
    }
    return value;
};

function QNode (value)
{
    this.value = value;
    this.next = null;
}