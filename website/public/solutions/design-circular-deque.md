# Design Circular Deque

## Problem Description

Design your implementation of the circular double-ended queue (deque).
Implement the MyCircularDeque class:

- `MyCircularDeque(int k)` Initializes the deque with a maximum size of k.
- `boolean insertFront()` Adds an item at the front of Deque. Returns true if the operation is successful, or false otherwise.
- `boolean insertLast()` Adds an item at the rear of Deque. Returns true if the operation is successful, or false otherwise.
- `boolean deleteFront()` Deletes an item from the front of Deque. Returns true if the operation is successful, or false otherwise.
- `boolean deleteLast()` Deletes an item from the rear of Deque. Returns true if the operation is successful, or false otherwise.
- `int getFront()` Returns the front item from the Deque. Returns -1 if the deque is empty.
- `int getRear()` Returns the last item from Deque. Returns -1 if the deque is empty.
- `boolean isEmpty()` Returns true if the deque is empty, or false otherwise.
- `boolean isFull()` Returns true if the deque is full, or false otherwise.

**LeetCode Link:** [Design Circular Deque - LeetCode 641](https://leetcode.com/problems/design-circular-deque/)

---

## Examples

### Example 1:

**Input:**
```python
["MyCircularDeque", "insertLast", "insertLast", "insertFront", "insertFront", "getRear", "isFull", "deleteLast", "insertFront", "getFront"]
[[3], [1], [2], [3], [4], [], [], [], [4], []]
```

**Output:**
```python
[null, true, true, true, false, 2, true, true, true, 4]
```

---

## Constraints

- `1 <= k <= 1000`
- `0 <= value <= 1000`
- At most `2000` calls will be made to insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty, isFull.

---

## Pattern: Circular Buffer with Head/Tail Pointers

This problem uses a **Circular Buffer** pattern where array indices wrap around using modulo arithmetic. The front pointer indicates the first element, and rear indicates the next insertion position. The size variable tracks the number of elements.

### Core Concept

- **Circular indexing**: Using modulo (%) to wrap indices around the array
- **Two pointers**: front points to first element, rear points to next insertion position
- **Size tracking**: Variable size tracks number of elements
- **Wrap-around math**: Move forward with (index + 1) % capacity, backward with (index - 1 + capacity) % capacity

### When to Use This Pattern

This pattern is applicable when:
1. Implementing fixed-size queue/deque
2. Circular buffer problems
3. Problems requiring O(1) operations at both ends

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Circular Queue | Single-ended circular queue |
| Ring Buffer | Fixed-size buffer with wrap-around |
| Array-based Deque | Deque implementation using arrays |

### Pattern Summary

This problem exemplifies **Circular Buffer Design**, characterized by:
- Fixed-size array with wrap-around indexing
- Front and rear pointers for O(1) operations
- Size tracking to distinguish empty/full states

---

## Intuition

The key insight is using a **circular buffer** with front and rear pointers. The array wraps around using modulo arithmetic, allowing efficient insertion and deletion at both ends.

### Key Observations

1. **Circular Indexing**: Using modulo (%) to wrap indices around the array
2. **Two Pointers**: `front` points to first element, `rear` points to next insertion position
3. **Size Tracking**: Variable `size` tracks number of elements (separate from pointer comparison)
4. **Wrap-Around Math**: 
   - Move forward: `(index + 1) % capacity`
   - Move backward: `(index - 1 + capacity) % capacity`

### Why Circular Works

In a regular array, removing from front requires shifting all elements. With circular indexing, we just move the front pointer back, and it wraps to the end - O(1) for all operations.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Array-based Circular Deque** - Using fixed array with pointers
2. **Doubly Linked List** - Alternative implementation

---

## Approach 1: Array-based Circular Deque (Optimal)

### Algorithm Steps

1. Initialize a fixed-size array of length k
2. Maintain front pointer (index of first element) and rear pointer (next insertion position)
3. Track current size to distinguish empty/full states
4. Use modulo arithmetic for wrap-around:
   - Insert front: move front back, then insert
   - Insert rear: insert at rear, then move rear forward
   - Delete front: move front forward
   - Delete rear: move rear backward
5. All operations O(1)

### Why It Works

The circular buffer充分利用数组的连续内存，同时通过指针回绕实现双端操作。size变量准确记录元素数量，区分空和满状态。

### Code Implementation

````carousel
```python
class MyCircularDeque:
    def __init__(self, k: int):
        """
        Initialize your data structure here.
        
        Args:
            k: Maximum size of the deque
        """
        self.data = [0] * k
        self.front = 0
        self.rear = 0
        self.size = 0
        self.capacity = k

    def insertFront(self, value: int) -> bool:
        """
        Adds an item at the front of Deque.
        
        Args:
            value: Value to add
            
        Returns:
            True if successful, False otherwise
        """
        if self.isFull():
            return False
        self.front = (self.front - 1 + self.capacity) % self.capacity
        self.data[self.front] = value
        self.size += 1
        return True

    def insertLast(self, value: int) -> bool:
        """
        Adds an item at the rear of Deque.
        
        Args:
            value: Value to add
            
        Returns:
            True if successful, False otherwise
        """
        if self.isFull():
            return False
        self.data[self.rear] = value
        self.rear = (self.rear + 1) % self.capacity
        self.size += 1
        return True

    def deleteFront(self) -> bool:
        """
        Deletes an item from the front of Deque.
        
        Returns:
            True if successful, False otherwise
        """
        if self.isEmpty():
            return False
        self.front = (self.front + 1) % self.capacity
        self.size -= 1
        return True

    def deleteLast(self) -> bool:
        """
        Deletes an item from the rear of Deque.
        
        Returns:
            True if successful, False otherwise
        """
        if self.isEmpty():
            return False
        self.rear = (self.rear - 1 + self.capacity) % self.capacity
        self.size -= 1
        return True

    def getFront(self) -> int:
        """
        Get the front item from the Deque.
        
        Returns:
            Front item, or -1 if empty
        """
        if self.isEmpty():
            return -1
        return self.data[self.front]

    def getRear(self) -> int:
        """
        Get the last item from Deque.
        
        Returns:
            Rear item, or -1 if empty
        """
        if self.isEmpty():
            return -1
        return self.data[(self.rear - 1 + self.capacity) % self.capacity]

    def isEmpty(self) -> bool:
        """Returns whether the Deque is empty."""
        return self.size == 0

    def isFull(self) -> bool:
        """Returns whether the Deque is full."""
        return self.size == self.capacity
```

<!-- slide -->
```cpp
class MyCircularDeque {
private:
    vector<int> data;
    int front;
    int rear;
    int size;
    int capacity;

public:
    /** Initialize your data structure here. */
    MyCircularDeque(int k) {
        data.resize(k);
        front = 0;
        rear = 0;
        size = 0;
        capacity = k;
    }
    
    /** Adds an item at the front of Deque. */
    bool insertFront(int value) {
        if (isFull()) return false;
        front = (front - 1 + capacity) % capacity;
        data[front] = value;
        size++;
        return true;
    }
    
    /** Adds an item at the rear of Deque. */
    bool insertLast(int value) {
        if (isFull()) return false;
        data[rear] = value;
        rear = (rear + 1) % capacity;
        size++;
        return true;
    }
    
    /** Deletes an item from the front of Deque. */
    bool deleteFront() {
        if (isEmpty()) return false;
        front = (front + 1) % capacity;
        size--;
        return true;
    }
    
    /** Deletes an item from the rear of Deque. */
    bool deleteLast() {
        if (isEmpty()) return false;
        rear = (rear - 1 + capacity) % capacity;
        size--;
        return true;
    }
    
    /** Get the front item. */
    int getFront() {
        if (isEmpty()) return -1;
        return data[front];
    }
    
    /** Get the last item. */
    int getRear() {
        if (isEmpty()) return -1;
        return data[(rear - 1 + capacity) % capacity];
    }
    
    /** Checks whether the circular deque is empty. */
    bool isEmpty() {
        return size == 0;
    }
    
    /** Checks whether the circular deque is full. */
    bool isFull() {
        return size == capacity;
    }
};
```

<!-- slide -->
```java
class MyCircularDeque {
    private int[] data;
    private int front;
    private int rear;
    private int size;
    private int capacity;

    /** Initialize your data structure here. */
    public MyCircularDeque(int k) {
        data = new int[k];
        front = 0;
        rear = 0;
        size = 0;
        capacity = k;
    }
    
    /** Adds an item at the front of Deque. */
    public boolean insertFront(int value) {
        if (isFull()) return false;
        front = (front - 1 + capacity) % capacity;
        data[front] = value;
        size++;
        return true;
    }
    
    /** Adds an item at the rear of Deque. */
    public boolean insertLast(int value) {
        if (isFull()) return false;
        data[rear] = value;
        rear = (rear + 1) % capacity;
        size++;
        return true;
    }
    
    /** Deletes an item from the front of Deque. */
    public boolean deleteFront() {
        if (isEmpty()) return false;
        front = (front + 1) % capacity;
        size--;
        return true;
    }
    
    /** Deletes an item from the rear of Deque. */
    public boolean deleteLast() {
        if (isEmpty()) return false;
        rear = (rear - 1 + capacity) % capacity;
        size--;
        return true;
    }
    
    /** Get the front item from the Deque. */
    public int getFront() {
        if (isEmpty()) return -1;
        return data[front];
    }
    
    /** Get the last item from the Deque. */
    public int getRear() {
        if (isEmpty()) return -1;
        return data[(rear - 1 + capacity) % capacity];
    }
    
    /** Checks whether the circular deque is empty. */
    public boolean isEmpty() {
        return size == 0;
    }
    
    /** Checks whether the circular deque is full. */
    public boolean isFull() {
        return size == capacity;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} k
 */
var MyCircularDeque = function(k) {
    this.data = new Array(k).fill(0);
    this.front = 0;
    this.rear = 0;
    this.size = 0;
    this.capacity = k;
};

/** 
 * Adds an item at the front of Deque. 
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertFront = function(value) {
    if (this.isFull()) return false;
    this.front = (this.front - 1 + this.capacity) % this.capacity;
    this.data[this.front] = value;
    this.size++;
    return true;
};

/** 
 * Adds an item at the rear of Deque. 
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertLast = function(value) {
    if (this.isFull()) return false;
    this.data[this.rear] = value;
    this.rear = (this.rear + 1) % this.capacity;
    this.size++;
    return true;
};

/**
 * Deletes an item from the front of Deque.
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteFront = function() {
    if (this.isEmpty()) return false;
    this.front = (this.front + 1) % this.capacity;
    this.size--;
    return true;
};

/**
 * Deletes an item from the rear of Deque.
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteLast = function() {
    if (this.isEmpty()) return false;
    this.rear = (this.rear - 1 + this.capacity) % this.capacity;
    this.size--;
    return true;
};

/**
 * Get the front item.
 * @return {number}
 */
MyCircularDeque.prototype.getFront = function() {
    if (this.isEmpty()) return -1;
    return this.data[this.front];
};

/**
 * Get the last item.
 * @return {number}
 */
MyCircularDeque.prototype.getRear = function() {
    if (this.isEmpty()) return -1;
    return this.data[(this.rear - 1 + this.capacity) % this.capacity];
};

/**
 * Checks whether the circular deque is empty.
 * @return {boolean}
 */
MyCircularDeque.prototype.isEmpty = function() {
    return this.size === 0;
};

/**
 * Checks whether the circular deque is full.
 * @return {boolean}
 */
MyCircularDeque.prototype.isFull = function() {
    return this.size === this.capacity;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for all operations |
| **Space** | O(k) where k is the maximum size |

---

## Approach 2: Doubly Linked List

### Algorithm Steps

1. Create a doubly linked list node structure
2. Maintain head and tail pointers
3. Track current size
4. For insertFront: create new node, insert before head
5. For insertLast: create new node, insert after tail
6. For deleteFront/deleteLast: remove node and update pointers

### Why It Works

Doubly linked list provides O(1) insertion/deletion at both ends. Each node has pointers to both previous and next nodes, allowing bidirectional traversal.

### Code Implementation

````carousel
```python
class Node:
    def __init__(self, value: int):
        self.value = value
        self.prev = None
        self.next = None

class MyCircularDeque:
    def __init__(self, k: int):
        self.capacity = k
        self.size = 0
        self.head = Node(-1)  # Dummy head
        self.tail = Node(-1)  # Dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head

    def _add_before(self, node: Node, value: int) -> Node:
        """Add node before given node."""
        new_node = Node(value)
        new_node.prev = node.prev
        new_node.next = node
        node.prev.next = new_node
        node.prev = new_node
        self.size += 1
        return new_node

    def _remove(self, node: Node) -> int:
        """Remove node and return its value."""
        value = node.value
        node.prev.next = node.next
        node.next.prev = node.prev
        self.size -= 1
        return value

    def insertFront(self, value: int) -> bool:
        if self.isFull():
            return False
        self._add_before(self.head.next, value)
        return True

    def insertLast(self, value: int) -> bool:
        if self.isFull():
            return False
        self._add_before(self.tail, value)
        return True

    def deleteFront(self) -> bool:
        if self.isEmpty():
            return False
        self._remove(self.head.next)
        return True

    def deleteLast(self) -> bool:
        if self.isEmpty():
            return False
        self._remove(self.tail.prev)
        return True

    def getFront(self) -> int:
        if self.isEmpty():
            return -1
        return self.head.next.value

    def getRear(self) -> int:
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
struct Node {
    int val;
    Node* prev;
    Node* next;
    Node(int x) : val(x), prev(nullptr), next(nullptr) {}
};

class MyCircularDeque {
private:
    Node* head;
    Node* tail;
    int size;
    int capacity;

public:
    MyCircularDeque(int k) {
        head = new Node(-1);
        tail = new Node(-1);
        head->next = tail;
        tail->prev = head;
        size = 0;
        capacity = k;
    }
    
    bool insertFront(int value) {
        if (isFull()) return false;
        Node* node = new Node(value);
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
        size++;
        return true;
    }
    
    bool insertLast(int value) {
        if (isFull()) return false;
        Node* node = new Node(value);
        node->prev = tail->prev;
        node->next = tail;
        tail->prev->next = node;
        tail->prev = node;
        size++;
        return true;
    }
    
    bool deleteFront() {
        if (isEmpty()) return false;
        Node* node = head->next;
        head->next = node->next;
        node->next->prev = head;
        delete node;
        size--;
        return true;
    }
    
    bool deleteLast() {
        if (isEmpty()) return false;
        Node* node = tail->prev;
        node->prev->next = tail;
        tail->prev = node->prev;
        delete node;
        size--;
        return true;
    }
    
    int getFront() {
        if (isEmpty()) return -1;
        return head->next->val;
    }
    
    int getRear() {
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
class MyCircularDeque {
    private class Node {
        int val;
        Node prev, next;
        Node(int v) { val = v; }
    }
    
    private Node head, tail;
    private int size, capacity;
    
    public MyCircularDeque(int k) {
        head = new Node(-1);
        tail = new Node(-1);
        head.next = tail;
        tail.prev = head;
        size = 0;
        capacity = k;
    }
    
    public boolean insertFront(int value) {
        if (isFull()) return false;
        Node node = new Node(value);
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
        size++;
        return true;
    }
    
    public boolean insertLast(int value) {
        if (isFull()) return false;
        Node node = new Node(value);
        node.prev = tail.prev;
        node.next = tail;
        tail.prev.next = node;
        tail.prev = node;
        size++;
        return true;
    }
    
    public boolean deleteFront() {
        if (isEmpty()) return false;
        Node node = head.next;
        head.next = node.next;
        node.next.prev = head;
        size--;
        return true;
    }
    
    public boolean deleteLast() {
        if (isEmpty()) return false;
        Node node = tail.prev;
        node.prev.next = tail;
        tail.prev = node.prev;
        size--;
        return true;
    }
    
    public int getFront() {
        if (isEmpty()) return -1;
        return head.next.val;
    }
    
    public int getRear() {
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
class MyCircularDeque {
    constructor(k) {
        this.capacity = k;
        this.size = 0;
        this.head = { val: -1, prev: null, next: null };
        this.tail = { val: -1, prev: null, next: null };
        this.head.next = this.tail;
        this.tail.prev = this.head;
    }
    
    insertFront(value) {
        if (this.isFull()) return false;
        const node = { val: value, prev: this.head, next: this.head.next };
        this.head.next.prev = node;
        this.head.next = node;
        this.size++;
        return true;
    }
    
    insertLast(value) {
        if (this.isFull()) return false;
        const node = { val: value, prev: this.tail.prev, next: this.tail };
        this.tail.prev.next = node;
        this.tail.prev = node;
        this.size++;
        return true;
    }
    
    deleteFront() {
        if (this.isEmpty()) return false;
        const node = this.head.next;
        this.head.next = node.next;
        node.next.prev = this.head;
        this.size--;
        return true;
    }
    
    deleteLast() {
        if (this.isEmpty()) return false;
        const node = this.tail.prev;
        node.prev.next = this.tail;
        this.tail.prev = node.prev;
        this.size--;
        return true;
    }
    
    getFront() {
        if (this.isEmpty()) return -1;
        return this.head.next.val;
    }
    
    getRear() {
        if (this.isEmpty()) return -1;
        return this.tail.prev.val;
    }
    
    isEmpty() {
        return this.size === 0;
    }
    
    isFull() {
        return this.size === this.capacity;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for all operations |
| **Space** | O(k) for storing nodes |

---

## Comparison of Approaches

| Aspect | Array-based | Doubly Linked List |
|--------|-------------|-------------------|
| **Time Complexity** | O(1) | O(1) |
| **Space Complexity** | O(k) | O(k) |
| **Cache Friendliness** | Better | Worse |
| **Implementation** | Simpler | More complex |
| **Recommended** | ✅ | For learning |

**Best Approach:** Use Approach 1 (Array-based) for production code. It has better cache performance and simpler implementation.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Microsoft, Google
- **Difficulty**: Medium
- **Concepts Tested**: Data Structure Design, Circular Buffers, Pointers

### Learning Outcomes

1. **Circular Buffer Design**: Master the circular array technique
2. **Pointer Manipulation**: Handle front/rear pointers correctly
3. **Edge Cases**: Handle empty/full states properly
4. **Space-Time Tradeoff**: Understand different implementation approaches

---

## Related Problems

Based on similar themes (Data Structure Design):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Design Circular Queue | [Link](https://leetcode.com/problems/design-circular-queue/) | Single-ended circular queue |
| Design Queue using Stacks | [Link](https://leetcode.com/problems/implement-queue-using-stacks/) | Queue using stacks |
| Design Deque | [Link](https://leetcode.com/problems/design-circular-deque/) | This problem |

### Pattern Reference

For more detailed explanations, see:
- **[Data Structure Design](/patterns/data-structures)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Design Circular Deque](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[Circular Buffer Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Understanding circular buffers
3. **[Data Structure Design](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Design patterns

---

## Follow-up Questions

### Q1: How would you implement a thread-safe circular deque?

**Answer:** Add locks (mutex) around all operations that modify the deque state. Use std::mutex in C++, threading.Lock in Python, or synchronized blocks in Java.

---

### Q2: Can you implement a dynamic circular deque that resizes?

**Answer:** When the deque becomes full, allocate a new larger array, copy existing elements (accounting for wrap-around), and update front/rear pointers.

---

### Q3: How does this compare to using collections.deque in Python?

**Answer:** Python's collections.deque is implemented as a dynamic circular buffer that can grow automatically. It provides O(1) append/pop from both ends.

---

## Common Pitfalls

### 1. Index wrapping mistakes
**Issue:** When moving pointers, always use modulo: `(index - 1 + capacity) % capacity` for moving backward, `(index + 1) % capacity` for moving forward.

**Solution:** Always use modular arithmetic with addition of capacity to handle negative values.

### 2. Off-by-one in getRear()
**Issue:** Since rear points to the next insertion position, getRear should access `(rear - 1 + capacity) % capacity`.

**Solution:** Remember rear is always one position past the last element.

### 3. Empty vs full conditions
**Issue:** Empty when `size == 0`, full when `size == capacity` - don't rely on pointer comparison.

**Solution:** Use explicit size tracking to distinguish empty/full states.

### 4. Negative modulo in Python
**Issue:** In Python, negative modulo handles differently; use `(front - 1) % capacity` to correctly wrap.

**Solution:** Add capacity before modulo: `(front - 1 + capacity) % capacity`.

---

## Summary

The **Design Circular Deque** problem demonstrates the **Circular Buffer** pattern:

- **Approach**: Fixed array with front/rear pointers using modulo for wrapping
- **All Operations**: O(1) time complexity
- **Space**: O(k) where k is the maximum size

Key insight: Using modulo arithmetic allows the front and rear pointers to wrap around the array, enabling efficient O(1) operations at both ends.

### Pattern Summary

This problem exemplifies **Circular Buffer Design**, characterized by:
- Fixed-size array with wrap-around indexing
- Front and rear pointers for O(1) operations
- Size tracking to distinguish empty/full states
- Modulo arithmetic for index wrapping

For more details on this pattern, see the **[Data Structure Design](/patterns/data-structures)** pattern.

---

## Additional Resources

- [LeetCode Problem 641](https://leetcode.com/problems/design-circular-deque/) - Official problem page
- [Circular Buffer - Wikipedia](https://en.wikipedia.org/wiki/Circular_buffer) - Buffer theory
- [Queue Data Structure](https://en.wikipedia.org/wiki/Queue_(abstract_data_type)) - Queue fundamentals
- [Pattern: Data Structures](/patterns/data-structures) - Comprehensive pattern guide
