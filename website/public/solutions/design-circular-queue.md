# Design Circular Queue

## Problem Description

Design your implementation of the circular queue. The circular queue is a linear data structure in which the operations are performed based on FIFO (First In First Out) principle, and the last position is connected back to the first position to make a circle. It is also called "Ring Buffer".

One of the benefits of the circular queue is that we can make use of the spaces in front of the queue. In a normal queue, once the queue becomes full, we cannot insert the next element even if there is a space in front of the queue. But using the circular queue, we can use the space to store new values.

Implement the `MyCircularQueue` class:

- `MyCircularQueue(k)` Initializes the object with the size of the queue to be `k`.
- `int Front()` Gets the front item from the queue. If the queue is empty, return `-1`.
- `int Rear()` Gets the last item from the queue. If the queue is empty, return `-1`.
- `boolean enQueue(int value)` Inserts an element into the circular queue. Return `true` if the operation is successful.
- `boolean deQueue()` Deletes an element from the circular queue. Return `true` if the operation is successful.
- `boolean isEmpty()` Checks whether the circular queue is empty or not.
- `boolean isFull()` Checks whether the circular queue is full or not.

You must solve the problem without using the built-in queue data structure in your programming language.

**Link to problem:** [Design Circular Queue - LeetCode 622](https://leetcode.com/problems/design-circular-queue/)

---

## Pattern: Ring Buffer Implementation

This problem demonstrates the **Ring Buffer** pattern for implementing a circular queue. The key is using modular arithmetic to wrap around the array indices.

### Core Concept

The fundamental idea is using a fixed-size array with two pointers:
- **Head pointer**: Points to the front element
- **Tail pointer**: Points to the next empty position
- **Modular arithmetic**: Wrap around using `(index + 1) % capacity`

### Why Array Size is k+1

We use `k+1` instead of `k` to distinguish between empty and full states:
- **Empty**: `head == tail`
- **Full**: `(tail + 1) % capacity == head`

---

## Examples

### Example

**Input:**
```
["MyCircularQueue", "enQueue", "enQueue", "enQueue", "enQueue", "Rear", "isFull", "deQueue", "enQueue", "Rear"]
[[3], [1], [2], [3], [4], [], [], [], [4], []]
```

**Output:**
```
[null, true, true, true, false, 3, true, true, true, 4]
```

**Explanation:**
```
MyCircularQueue myCircularQueue = new MyCircularQueue(3);
myCircularQueue.enQueue(1); // return True
myCircularQueue.enQueue(2); // return True
myCircularQueue.enQueue(3); // return True
myCircularQueue.enQueue(4); // return False
myCircularQueue.Rear();     // return 3
myCircularQueue.isFull();   // return True
myCircularQueue.deQueue();  // return True
myCircularQueue.enQueue(4); // return True
myCircularQueue.Rear();     // return 4
```

---

## Constraints

- `1 <= k <= 1000`
- `0 <= value <= 1000`
- At most 3000 calls will be made to `enQueue`, `deQueue`, `Front`, `Rear`, `isEmpty`, and `isFull`.

---

## Intuition

The key insight is treating the array as circular by using modular arithmetic:
1. When adding: Move tail forward: `tail = (tail + 1) % capacity`
2. When removing: Move head forward: `head = (head + 1) % capacity`
3. Check empty: `head == tail`
4. Check full: `(tail + 1) % capacity == head`

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Array-based (Optimal)** - Using fixed array with head/tail pointers
2. **Linked List-based** - Using a doubly linked list

---

## Approach 1: Array-based (Optimal)

This is the most space-efficient and commonly used approach.

### Algorithm Steps

1. Create an array of size `k+1`
2. Initialize `head = 0`, `tail = 0`, `capacity = k + 1`
3. For `enQueue`: Check if full, add element at tail, move tail forward
4. For `deQueue`: Check if empty, move head forward
5. For `Front`: Return element at head if not empty
6. For `Rear`: Return element before tail (with wrap-around)
7. Implement `isEmpty` and `isFull` as per formulas

### Code Implementation

````carousel
```python
class MyCircularQueue:

    def __init__(self, k: int):
        """
        Initialize your data structure here. Set the size of the queue to be k.
        """
        self.queue = [0] * (k + 1)
        self.head = 0
        self.tail = 0
        self.capacity = k + 1

    def enQueue(self, value: int) -> bool:
        """
        Insert an element into the circular queue. Return true if the operation is successful.
        """
        if self.isFull():
            return False
        self.queue[self.tail] = value
        self.tail = (self.tail + 1) % self.capacity
        return True

    def deQueue(self) -> bool:
        """
        Delete an element from the circular queue. Return true if the operation is successful.
        """
        if self.isEmpty():
            return False
        self.head = (self.head + 1) % self.capacity
        return True

    def Front(self) -> int:
        """
        Get the front item from the queue.
        """
        if self.isEmpty():
            return -1
        return self.queue[self.head]

    def Rear(self) -> int:
        """
        Get the last item from the queue.
        """
        if self.isEmpty():
            return -1
        return self.queue[(self.tail - 1 + self.capacity) % self.capacity]

    def isEmpty(self) -> bool:
        """
        Checks whether the circular queue is empty.
        """
        return self.head == self.tail

    def isFull(self) -> bool:
        """
        Checks whether the circular queue is full.
        """
        return (self.tail + 1) % self.capacity == self.head
```

<!-- slide -->
```cpp
class MyCircularQueue {
private:
    vector<int> queue;
    int head;
    int tail;
    int capacity;
    
public:
    MyCircularQueue(int k) {
        queue = vector<int>(k + 1);
        head = 0;
        tail = 0;
        capacity = k + 1;
    }
    
    bool enQueue(int value) {
        if (isFull()) return false;
        queue[tail] = value;
        tail = (tail + 1) % capacity;
        return true;
    }
    
    bool deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % capacity;
        return true;
    }
    
    int Front() {
        if (isEmpty()) return -1;
        return queue[head];
    }
    
    int Rear() {
        if (isEmpty()) return -1;
        return queue[(tail - 1 + capacity) % capacity];
    }
    
    bool isEmpty() {
        return head == tail;
    }
    
    bool isFull() {
        return (tail + 1) % capacity == head;
    }
};
```

<!-- slide -->
```java
class MyCircularQueue {
    private int[] queue;
    private int head;
    private int tail;
    private int capacity;
    
    public MyCircularQueue(int k) {
        queue = new int[k + 1];
        head = 0;
        tail = 0;
        capacity = k + 1;
    }
    
    public boolean enQueue(int value) {
        if (isFull()) return false;
        queue[tail] = value;
        tail = (tail + 1) % capacity;
        return true;
    }
    
    public boolean deQueue() {
        if (isEmpty()) return false;
        head = (head + 1) % capacity;
        return true;
    }
    
    public int Front() {
        if (isEmpty()) return -1;
        return queue[head];
    }
    
    public int Rear() {
        if (isEmpty()) return -1;
        return queue[(tail - 1 + capacity) % capacity];
    }
    
    public boolean isEmpty() {
        return head == tail;
    }
    
    public boolean isFull() {
        return (tail + 1) % capacity == head;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} k
 */
var MyCircularQueue = function(k) {
    this.queue = new Array(k + 1);
    this.head = 0;
    this.tail = 0;
    this.capacity = k + 1;
};

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularQueue.prototype.enQueue = function(value) {
    if (this.isFull()) return false;
    this.queue[this.tail] = value;
    this.tail = (this.tail + 1) % this.capacity;
    return true;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.deQueue = function() {
    if (this.isEmpty()) return false;
    this.head = (this.head + 1) % this.capacity;
    return true;
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Front = function() {
    if (this.isEmpty()) return -1;
    return this.queue[this.head];
};

/**
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function() {
    if (this.isEmpty()) return -1;
    return this.queue[(this.tail - 1 + this.capacity) % this.capacity];
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function() {
    return this.head === this.tail;
};

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function() {
    return (this.tail + 1) % this.capacity === this.head;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for all operations |
| **Space** | O(k) - Fixed size array |

---

## Approach 2: Linked List-based

This approach uses a doubly linked list to implement the circular queue.

### Code Implementation

````carousel
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None
        self.prev = None

class MyCircularQueue:

    def __init__(self, k: int):
        self.capacity = k
        self.size = 0
        self.head = Node(-1)  # Dummy head
        self.tail = Node(-1)  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def enQueue(self, value: int) -> bool:
        if self.isFull():
            return False
        new_node = Node(value)
        new_node.prev = self.tail.prev
        new_node.next = self.tail
        self.tail.prev.next = new_node
        self.tail.prev = new_node
        self.size += 1
        return True

    def deQueue(self) -> bool:
        if self.isEmpty():
            return False
        node_to_remove = self.head.next
        self.head.next = node_to_remove.next
        node_to_remove.next.prev = self.head
        self.size -= 1
        return True

    def Front(self) -> int:
        if self.isEmpty():
            return -1
        return self.head.next.value

    def Rear(self) -> int:
        if self.isEmpty():
            return -1
        return self.tail.prev.value

    def isEmpty(self) -> bool:
        return self.size == 0

    def isFull(self) -> bool:
        return self.size == self.capacity
```

<!-- slide -->
```cpp
class MyCircularQueue {
private:
    struct Node {
        int val;
        Node* next;
        Node* prev;
        Node(int v) : val(v), next(nullptr), prev(nullptr) {}
    };
    
    int capacity;
    int size;
    Node* head;
    Node* tail;
    
public:
    MyCircularQueue(int k) {
        capacity = k;
        size = 0;
        head = new Node(-1);
        tail = new Node(-1);
        head->next = tail;
        tail->prev = head;
    }
    
    bool enQueue(int value) {
        if (isFull()) return false;
        Node* newNode = new Node(value);
        newNode->prev = tail->prev;
        newNode->next = tail;
        tail->prev->next = newNode;
        tail->prev = newNode;
        size++;
        return true;
    }
    
    bool deQueue() {
        if (isEmpty()) return false;
        Node* toRemove = head->next;
        head->next = toRemove->next;
        toRemove->next->prev = head;
        size--;
        delete toRemove;
        return true;
    }
    
    int Front() {
        if (isEmpty()) return -1;
        return head->next->val;
    }
    
    int Rear() {
        if (isEmpty()) return -1;
        return tail->prev->val;
    }
    
    bool isEmpty() {
        return size == 0;
    }
    
    bool isFull() {
        return size == capacity;
    }
};
```

<!-- slide -->
```java
class MyCircularQueue {
    private class Node {
        int val;
        Node prev;
        Node next;
        Node(int v) { val = v; }
    }
    
    private int capacity;
    private int size;
    private Node head;
    private Node tail;
    
    public MyCircularQueue(int k) {
        capacity = k;
        size = 0;
        head = new Node(-1);
        tail = new Node(-1);
        head.next = tail;
        tail.prev = head;
    }
    
    public boolean enQueue(int value) {
        if (isFull()) return false;
        Node newNode = new Node(value);
        newNode.prev = tail.prev;
        newNode.next = tail;
        tail.prev.next = newNode;
        tail.prev = newNode;
        size++;
        return true;
    }
    
    public boolean deQueue() {
        if (isEmpty()) return false;
        Node toRemove = head.next;
        head.next = toRemove.next;
        toRemove.next.prev = head;
        size--;
        return true;
    }
    
    public int Front() {
        if (isEmpty()) return -1;
        return head.next.val;
    }
    
    public int Rear() {
        if (isEmpty()) return -1;
        return tail.prev.val;
    }
    
    public boolean isEmpty() {
        return size == 0;
    }
    
    public boolean isFull() {
        return size == capacity;
    }
}
```

<!-- slide -->
```javascript
function Node(value) {
    this.val = value;
    this.next = null;
    this.prev = null;
}

var MyCircularQueue = function(k) {
    this.capacity = k;
    this.size = 0;
    this.head = new Node(-1);
    this.tail = new Node(-1);
    this.head.next = this.tail;
    this.tail.prev = this.head;
};

MyCircularQueue.prototype.enQueue = function(value) {
    if (this.isFull()) return false;
    const newNode = new Node(value);
    newNode.prev = this.tail.prev;
    newNode.next = this.tail;
    this.tail.prev.next = newNode;
    this.tail.prev = newNode;
    this.size++;
    return true;
};

MyCircularQueue.prototype.deQueue = function() {
    if (this.isEmpty()) return false;
    const toRemove = this.head.next;
    this.head.next = toRemove.next;
    toRemove.next.prev = this.head;
    this.size--;
    return true;
};

MyCircularQueue.prototype.Front = function() {
    if (this.isEmpty()) return -1;
    return this.head.next.val;
};

MyCircularQueue.prototype.Rear = function() {
    if (this.isEmpty()) return -1;
    return this.tail.prev.val;
};

MyCircularQueue.prototype.isEmpty = function() {
    return this.size === 0;
};

MyCircularQueue.prototype.isFull = function() {
    return this.size === this.capacity;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for all operations |
| **Space** | O(k) - Linked list nodes |

---

## Comparison of Approaches

| Aspect | Array-based | Linked List |
|--------|-------------|--------------|
| **Time Complexity** | O(1) | O(1) |
| **Space Complexity** | O(k) | O(k) |
| **Cache Friendly** | Yes | No |
| **Implementation** | Simple | More complex |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |

---

## Visual Representation

```
Array: [_, _, _, _, _]
       ↑           ↑
      head       tail
      (k=4, capacity=5)

After enQueue(1,2,3):
       [1, 2, 3, _, _]
               ↑       ↑
              head   tail

After deQueue() (removes 1):
       [_, 2, 3, _, _]
           ↑       ↑
          tail   head

After enQueue(4):
       [4, 2, 3, _, _]
           ↑       ↑
          tail   head
```

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design Circular Deque | [Link](https://leetcode.com/problems/design-circular-deque/) | Double-ended queue |
| Design Twitter | [Link](https://leetcode.com/problems/design-twitter/) | Uses queue internally |

---

## Video Tutorial Links

- [NeetCode - Design Circular Queue](https://www.youtube.com/watch?v=R_MLCuG2Sts) - Official solution
- [Ring Buffer Explained](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Visual explanation

---

## Follow-up Questions

### Q1: Why use k+1 instead of k for array size?

**Answer:** To distinguish between empty and full states. With k slots, we can't tell the difference between an empty queue (head == tail) and a full queue (also head == tail). Using k+1 allows us to differentiate.

---

### Q2: How would you handle very large queue sizes?

**Answer:** The array approach works well. For extremely large sizes, consider using a memory-mapped file or a combination of fixed-size blocks.

---

### Q3: Can you implement it thread-saddfe?

**Answer:** The basic implementation is not thread-safe. You'd need locks (mutex) for concurrent access, which would add overhead.

---

## Common Pitfalls

### 1. Off-by-One in Capacity
**Issue:** Using k instead of k+1 for array size.

**Solution:** Remember to use k+1 to distinguish empty from full.

### 2. Modulo Arithmetic Errors
**Issue:** Incorrect modulo calculations for wrap-around.

**Solution:** Always use `(index + 1) % capacity` for moving forward.

### 3. Rear Calculation
**Issue:** Wrong formula for rear when tail is at 0.

**Solution:** Use `(tail - 1 + capacity) % capacity`.

---

## Summary

The **Design Circular Queue** problem demonstrates the ring buffer pattern:
- Use modular arithmetic for circular indexing
- Use k+1 array size to distinguish empty/full
- All operations are O(1)
- Array-based is more cache-friendly and preferred
