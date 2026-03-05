# Design - General/Specific

## Problem Description

The **Design (General/Specific)** pattern is used to solve problems requiring the design of data structures or systems with specific constraints. This pattern involves careful consideration of trade-offs between time complexity, space complexity, and usability based on problem requirements.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Operations to be supported with constraints |
| **Output** | Custom data structure meeting requirements |
| **Key Insight** | Choose appropriate data structures based on operation frequency |
| **Time Complexity** | Varies based on design (typically O(1) or O(log n) per operation) |
| **Space Complexity** | Varies based on design requirements |

### When to Use

- **Designing custom data structures**: LRU Cache, LFU Cache, Rate Limiter
- **System design problems**: Implementing specific system requirements
- **Data structure combinations**: Using multiple DS together for efficiency
- **Constraint satisfaction**: Meeting specific time/space constraints
- **Real-world modeling**: Implementing actual system components

---

## Intuition

### Core Insight

The key insight behind design problems is that **no single data structure is perfect for all operations**:

1. **Analyze required operations** - What operations need to be fast? Get? Put? Delete? Search?
2. **Identify the bottleneck** - Which operation will be called most frequently?
3. **Combine data structures** - Often need to combine (e.g., HashMap + Doubly Linked List for LRU)
4. **Trade-offs are essential** - Optimize for the common case, accept slower less frequent operations

### The "Aha!" Moments

1. **Why not just use a HashMap for everything?** HashMaps don't maintain order. For LRU, you need to track both access and recency - requiring a combination of HashMap (O(1) lookup) and Linked List (O(1) reordering).

2. **Why OrderedDict/Doubly Linked List?** These maintain insertion/access order efficiently. When you access an item, you need to move it to the "most recent" position in O(1) time.

3. **What's the pattern for these problems?** Most design problems follow: Identify operations → Pick data structures → Handle edge cases → Maintain invariants.

### Design Process Visualization

```
Problem: LRU Cache
Requirements:
├── get(key) - O(1)
├── put(key, value) - O(1)
└── evict when capacity reached

Analysis:
├── Fast lookup → HashMap
├── Fast removal of oldest → Linked List
└── Fast reordering → Doubly Linked List

Solution: HashMap + Doubly Linked List
├── HashMap: key → node pointer
└── Linked List: maintains recency order
```

---

## Solution Approaches

### Approach 1: LRU Cache - HashMap + Doubly Linked List ⭐

The classic design problem combining HashMap for O(1) lookup and Doubly Linked List for O(1) reordering.

#### Algorithm

1. **HashMap** stores key → node pointer for O(1) lookup
2. **Doubly Linked List** maintains nodes in recency order (head = most recent, tail = least recent)
3. **get(key)**: 
   - If exists, move node to head (most recent) and return value
   - If not exists, return -1
4. **put(key, value)**:
   - If exists, update value and move to head
   - If new, create node, add to head
   - If capacity exceeded, remove tail (least recent) and its HashMap entry

#### Implementation

````carousel
```python
from collections import OrderedDict

class LRUCache:
    """
    LRU Cache implementation using OrderedDict.
    OrderedDict maintains insertion order and allows O(1) move_to_end.
    """
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        # Move to end (most recently used)
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            # Update and mark as recently used
            self.cache.move_to_end(key)
        self.cache[key] = value
        
        if len(self.cache) > self.capacity:
            # Remove least recently used (first item)
            self.cache.popitem(last=False)


# Manual implementation using Doubly Linked List
class ListNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCacheManual:
    """
    Manual implementation using HashMap + Doubly Linked List.
    Better for understanding the internals.
    """
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = {}  # key -> node
        
        # Dummy head and tail nodes
        self.head = ListNode()
        self.tail = ListNode()
        self.head.next = self.tail
        self.tail.prev = self.head
        
        self.size = 0
    
    def _remove(self, node):
        """Remove node from linked list"""
        prev, nxt = node.prev, node.next
        prev.next = nxt
        nxt.prev = prev
    
    def _add_to_head(self, node):
        """Add node right after head (most recent)"""
        node.prev = self.head
        node.next = self.head.next
        self.head.next.prev = node
        self.head.next = node
    
    def _move_to_head(self, node):
        """Move existing node to head"""
        self._remove(node)
        self._add_to_head(node)
    
    def _pop_tail(self):
        """Remove and return the tail node (least recent)"""
        res = self.tail.prev
        self._remove(res)
        return res
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        
        node = self.cache[key]
        # Move to head (mark as recently used)
        self._move_to_head(node)
        return node.val
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            # Update existing
            node = self.cache[key]
            node.val = value
            self._move_to_head(node)
        else:
            # Create new node
            new_node = ListNode(key, value)
            self.cache[key] = new_node
            self._add_to_head(new_node)
            self.size += 1
            
            if self.size > self.capacity:
                # Remove least recently used
                tail = self._pop_tail()
                del self.cache[tail.key]
                self.size -= 1
```

<!-- slide -->
```cpp
#include <unordered_map>
using namespace std;

struct DLinkedNode {
    int key, val;
    DLinkedNode* prev;
    DLinkedNode* next;
    DLinkedNode(int k=0, int v=0): key(k), val(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
private:
    unordered_map<int, DLinkedNode*> cache;
    DLinkedNode* head;
    DLinkedNode* tail;
    int capacity;
    int size;
    
    void addToHead(DLinkedNode* node) {
        node->prev = head;
        node->next = head->next;
        head->next->prev = node;
        head->next = node;
    }
    
    void removeNode(DLinkedNode* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
    
    void moveToHead(DLinkedNode* node) {
        removeNode(node);
        addToHead(node);
    }
    
    DLinkedNode* removeTail() {
        DLinkedNode* node = tail->prev;
        removeNode(node);
        return node;
    }
    
public:
    LRUCache(int capacity) {
        this->capacity = capacity;
        this->size = 0;
        head = new DLinkedNode();
        tail = new DLinkedNode();
        head->next = tail;
        tail->prev = head;
    }
    
    int get(int key) {
        if (!cache.count(key)) return -1;
        
        DLinkedNode* node = cache[key];
        moveToHead(node);
        return node->val;
    }
    
    void put(int key, int value) {
        if (!cache.count(key)) {
            DLinkedNode* node = new DLinkedNode(key, value);
            cache[key] = node;
            addToHead(node);
            size++;
            
            if (size > capacity) {
                DLinkedNode* removed = removeTail();
                cache.erase(removed->key);
                delete removed;
                size--;
            }
        } else {
            DLinkedNode* node = cache[key];
            node->val = value;
            moveToHead(node);
        }
    }
};
```

<!-- slide -->
```java
import java.util.HashMap;
import java.util.Map;

class LRUCache {
    class DLinkedNode {
        int key;
        int value;
        DLinkedNode prev;
        DLinkedNode next;
    }
    
    private Map<Integer, DLinkedNode> cache = new HashMap<>();
    private int size;
    private int capacity;
    private DLinkedNode head, tail;
    
    private void addNode(DLinkedNode node) {
        node.prev = head;
        node.next = head.next;
        head.next.prev = node;
        head.next = node;
    }
    
    private void removeNode(DLinkedNode node) {
        DLinkedNode prev = node.prev;
        DLinkedNode next = node.next;
        prev.next = next;
        next.prev = prev;
    }
    
    private void moveToHead(DLinkedNode node) {
        removeNode(node);
        addNode(node);
    }
    
    private DLinkedNode popTail() {
        DLinkedNode res = tail.prev;
        removeNode(res);
        return res;
    }
    
    public LRUCache(int capacity) {
        this.size = 0;
        this.capacity = capacity;
        
        head = new DLinkedNode();
        tail = new DLinkedNode();
        head.next = tail;
        tail.prev = head;
    }
    
    public int get(int key) {
        DLinkedNode node = cache.get(key);
        if (node == null) return -1;
        
        moveToHead(node);
        return node.value;
    }
    
    public void put(int key, int value) {
        DLinkedNode node = cache.get(key);
        
        if (node == null) {
            DLinkedNode newNode = new DLinkedNode();
            newNode.key = key;
            newNode.value = value;
            
            cache.put(key, newNode);
            addNode(newNode);
            size++;
            
            if (size > capacity) {
                DLinkedNode tail = popTail();
                cache.remove(tail.key);
                size--;
            }
        } else {
            node.value = value;
            moveToHead(node);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // maintains insertion order
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    if (!this.cache.has(key)) return -1;
    
    const value = this.cache.get(key);
    // Delete and re-insert to move to end (most recent)
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
};

/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    if (this.cache.has(key)) {
        this.cache.delete(key);
    }
    this.cache.set(key, value);
    
    if (this.cache.size > this.capacity) {
        // Remove least recently used (first item)
        const firstKey = this.cache.keys().next().value;
        this.cache.delete(firstKey);
    }
};

// Manual implementation with Doubly Linked List
class DLinkedNode {
    constructor(key=0, val=0) {
        this.key = key;
        this.val = val;
        this.prev = null;
        this.next = null;
    }
}

class LRUCacheManual {
    constructor(capacity) {
        this.capacity = capacity;
        this.cache = new Map();
        this.head = new DLinkedNode();
        this.tail = new DLinkedNode();
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.size = 0;
    }
    
    _remove(node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    
    _addToHead(node) {
        node.prev = this.head;
        node.next = this.head.next;
        this.head.next.prev = node;
        this.head.next = node;
    }
    
    _moveToHead(node) {
        this._remove(node);
        this._addToHead(node);
    }
    
    _popTail() {
        const res = this.tail.prev;
        this._remove(res);
        return res;
    }
    
    get(key) {
        if (!this.cache.has(key)) return -1;
        
        const node = this.cache.get(key);
        this._moveToHead(node);
        return node.val;
    }
    
    put(key, value) {
        if (this.cache.has(key)) {
            const node = this.cache.get(key);
            node.val = value;
            this._moveToHead(node);
        } else {
            const newNode = new DLinkedNode(key, value);
            this.cache.set(key, newNode);
            this._addToHead(newNode);
            this.size++;
            
            if (this.size > this.capacity) {
                const tail = this._popTail();
                this.cache.delete(tail.key);
                this.size--;
            }
        }
    }
}
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) for both get and put operations |
| **Space** | O(capacity) - limited by the cache capacity |

---

### Approach 2: Min Stack

Design a stack that supports push, pop, top, and retrieving the minimum element in O(1).

#### Algorithm

1. Use two stacks: `stack` for regular operations, `min_stack` to track minimums
2. Push: push to main stack, push to min_stack if value ≤ current min
3. Pop: pop from main stack, if value equals min_stack top, pop min_stack too
4. GetMin: return min_stack top

#### Implementation

````carousel
```python
class MinStack:
    """
    Stack with O(1) min operation using auxiliary min stack.
    """
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val: int) -> None:
        self.stack.append(val)
        # Push to min_stack if empty or val is smaller/equal to current min
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self) -> None:
        val = self.stack.pop()
        # If popped value is current min, remove from min_stack too
        if val == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self) -> int:
        return self.stack[-1]
    
    def getMin(self) -> int:
        return self.min_stack[-1]
```

<!-- slide -->
```cpp
#include <stack>
using namespace std;

class MinStack {
private:
    stack<int> s;
    stack<int> min_s;
    
public:
    MinStack() {}
    
    void push(int val) {
        s.push(val);
        if (min_s.empty() || val <= min_s.top()) {
            min_s.push(val);
        }
    }
    
    void pop() {
        if (s.top() == min_s.top()) {
            min_s.pop();
        }
        s.pop();
    }
    
    int top() {
        return s.top();
    }
    
    int getMin() {
        return min_s.top();
    }
};
```

<!-- slide -->
```java
import java.util.Stack;

class MinStack {
    private Stack<Integer> stack;
    private Stack<Integer> minStack;
    
    public MinStack() {
        stack = new Stack<>();
        minStack = new Stack<>();
    }
    
    public void push(int val) {
        stack.push(val);
        if (minStack.isEmpty() || val <= minStack.peek()) {
            minStack.push(val);
        }
    }
    
    public void pop() {
        if (stack.pop().equals(minStack.peek())) {
            minStack.pop();
        }
    }
    
    public int top() {
        return stack.peek();
    }
    
    public int getMin() {
        return minStack.peek();
    }
}
```

<!-- slide -->
```javascript
/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
var MinStack = function() {
    this.stack = [];
    this.minStack = [];
};

/** 
 * @param {number} val
 * @return {void}
 */
MinStack.prototype.push = function(val) {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.minStack[this.minStack.length - 1]) {
        this.minStack.push(val);
    }
};

/**
 * @return {void}
 */
MinStack.prototype.pop = function() {
    const val = this.stack.pop();
    if (val === this.minStack[this.minStack.length - 1]) {
        this.minStack.pop();
    }
};

/**
 * @return {number}
 */
MinStack.prototype.top = function() {
    return this.stack[this.stack.length - 1];
};

/**
 * @return {number}
 */
MinStack.prototype.getMin = function() {
    return this.minStack[this.minStack.length - 1];
};
```
````

---

## Complexity Analysis

| Data Structure | Operation | Time Complexity | Space Complexity |
|----------------|-----------|-----------------|------------------|
| **LRU Cache** | get | O(1) | O(capacity) |
| **LRU Cache** | put | O(1) | O(capacity) |
| **Min Stack** | push | O(1) | O(n) |
| **Min Stack** | pop | O(1) | O(n) |
| **Min Stack** | getMin | O(1) | O(n) |

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **LRU Cache** | [Link](https://leetcode.com/problems/lru-cache/) | Classic design problem |
| **Min Stack** | [Link](https://leetcode.com/problems/min-stack/) | Stack with O(1) min |
| **Design Underground System** | [Link](https://leetcode.com/problems/design-underground-system/) | Tracking system design |
| **Insert Delete GetRandom O(1)** | [Link](https://leetcode.com/problems/insert-delete-getrandom-o1/) | HashMap + ArrayList |
| **Time Based Key-Value Store** | [Link](https://leetcode.com/problems/time-based-key-value-store/) | Binary search + HashMap |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **LFU Cache** | [Link](https://leetcode.com/problems/lfu-cache/) | Least Frequently Used cache |
| **Design In-Memory File System** | [Link](https://leetcode.com/problems/design-in-memory-file-system/) | File system design |
| **Design Excel Sum Formula** | [Link](https://leetcode.com/problems/design-excel-sum-formula/) | Spreadsheet design |
| **Design Log Storage System** | [Link](https://leetcode.com/problems/design-log-storage-system/) | Query system design |

---

## Video Tutorial Links

1. [NeetCode - LRU Cache](https://www.youtube.com/watch?v=7ABFKZQ2qfY) - Complete explanation of HashMap + Linked List
2. [Min Stack - Back To Back SWE](https://www.youtube.com/watch?v=wxYq7CVC6Jo) - Two stack approach
3. [System Design Primer](https://www.youtube.com/watch?v=uzO2L9cZEtc) - General design concepts
4. [Data Structure Design Patterns](https://www.youtube.com/watch?v=K7N4UQ7Z8-Q) - Common patterns in design problems

---

## Summary

### Key Takeaways

1. **Analyze operations first** - Understand which operations need to be fast
2. **Combine data structures** - Most design problems need multiple DS (HashMap + something)
3. **Trade-offs are acceptable** - Optimize for common case, accept slower rare operations
4. **Maintain invariants** - Ensure data structures stay consistent after each operation
5. **Edge cases matter** - Empty, single element, capacity full scenarios

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Overcomplicating the design** | Start simple, add complexity only when needed |
| **Wrong data structure choice** | List for random access = O(n); use HashMap for O(1) |
| **Not handling edge cases** | Test empty, single element, and full capacity cases |
| **Forgetting to update auxiliary DS** | When main DS changes, update the helper DS too |
| **Not considering time/space trade-offs** | Document why specific choices were made |

### Follow-up Questions

**Q1: How would you implement an LFU (Least Frequently Used) Cache?**

Use multiple data structures: HashMap for key→value, another HashMap for key→frequency, and a TreeSet or LinkedHashSet per frequency bucket to track recency within each frequency.

**Q2: Can you make LRU Cache thread-safe?**

Add locks around get/put operations. Consider using ReadWriteLock for better concurrency when reads outnumber writes.

**Q3: How would you design a cache with expiration times?**

Use a priority queue (min-heap) ordered by expiration time, plus a HashMap. Periodically clean expired entries or check expiration on access.

---

## Pattern Source

For more design and data structure patterns, see:
- **[Heap - Top K Elements](/patterns/heap-top-k-elements-selection-frequency)**
- **[Heap - Scheduling](/patterns/heap-scheduling-minimum-cost-greedy-with-priority-queue)**
- **[Graph - Union Find](/patterns/graph-union-find-disjoint-set-union-dsu)**

---

## Additional Resources

- [LeetCode LRU Cache](https://leetcode.com/problems/lru-cache/)
- [LeetCode Min Stack](https://leetcode.com/problems/min-stack/)
- [GeeksforGeeks Design Patterns](https://www.geeksforgeeks.org/design-patterns/)
- [System Design Primer - GitHub](https://github.com/donnemartin/system-design-primer)
