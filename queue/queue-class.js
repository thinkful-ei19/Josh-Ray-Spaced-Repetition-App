'use strict';
class _Node {
  constructor(value) {
    this.value = value,
    this.next = null,
    this.prev = null;
  }
}

class Queue {
  constructor(value) {
    this.first = null;
    this.last = null;
  }

  // INSERT INTO QUEUE
  enqueue(data) {
    const node = new _Node(data);

    if(this.first === null) {
      this.first = node;
    }

    if(this.last) {
      node.next = this.last;
      this.last.prev = node;
    }

    this.last = node;
  }


  // REMOVE FROM QUEUE
  dequeue() {
    if(this.first === null) {
      return;
    }

    const node = this.first;
    this.first = node.prev;

    if(node === this.last) {
      this.last = null;
    }

    return node.value;
  }
}

// SEE FIRST NODE IN QUEUE
function peek(queue) {
  let currNode = queue.first;
  let displayQueue = currNode.value;
  return displayQueue;
};


// SEE WHOLE QUEUE
function display(queue) {
  if(queue.first === null) {
    return null;
  }
  let currNode = queue.first;
  while(currNode) {
    console.log(currNode.value);
    currNode = currNode.prev;
  }
}

module.exports = { Queue, peek, display };