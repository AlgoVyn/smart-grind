# Design Most Recently Used Queue

## Problem Description

Design a Most Recently Used (MRU) queue that supports fetching the k-th most recently used element.

Implement the MRUQueue class with the following methods:
- `MRUQueue(n: int)`: Initialize the queue with elements [1, 2, ..., n].
- `fetch(k: int) -> int`: Fetch the k-th element (1-indexed), remove it from its current position, and append it to the end of the queue. Return the value of the element.

**Link to problem:** [Design Most Recently Used Queue - LeetCode 1823](https://leetcode.com/problems/find-the-winner-of-the-game/)

---

## Examples

### Example 1:

**Input:**
```
n = 4, fetch(1)
```

**Output:**
```
1
```

**Explanation:** Initial queue is [1, 2, 3, 4]. Fetching the 1st most recently used element returns 1, and the queue becomes [2, 3, 4, 1].

### Example 2:

**Input:**
```
n = 4, fetch(2)
```

**Output:**
```
3
```

**Explanation:** Initial queue is [1, 2, 3, 4]. Fetching the 2nd most recently used element returns 3, and the queue becomes [1, 2, 4, 3].

### Example 3:

**Input:**
```
n = 8, fetch(4)
```

**Output:**
```
5
```

**Explanation:** Initial queue is [1, 2, 3, 4, 5, 6, 7, 8]. Fetching the 4th most recently used element returns 5, and the queue becomes [1, 2, 3, 6, 7, 8, 5].

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= n <= 10^5` | Initial number of elements |
| `1 <= k <= n` | Valid fetch index |

---

## Pattern: Array/List Simulation

This problem involves maintaining a dynamic list with specific operations. The key is to efficiently manage element positions when moving items from the middle to the end.

### Core Concept

- **List-based Storage**: Use a dynamic array/list to store elements
- **Index-based Access**: Access k-th element using 0-indexed (k-1)
- **Move to End**: Remove element and append to end (most recently used position)
- **Time-Space Tradeoff**: Simple implementation with O(n) per operation

---

## Intuition

The MRU (Most Recently Used) queue operates on a simple principle:
1. Elements at the front are "less recently used"
2. Elements at the back are "more recently used"
3. Fetching an element moves it to the back (most recently used position)

The straightforward approach uses a list where:
- Index 0 = least recently used
- Index -1 (end) = most recently used

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Simple List** - O(n) per fetch, O(n) space
2. **Fenwick Tree (Binary Indexed Tree)** - O(log n) per fetch, O(n) space (optimized)

---

## Approach 1: Simple List Implementation

This is the straightforward approach using a Python list to simulate the queue.

### Algorithm Steps

1. **Initialize**: Create a list with elements [1, 2, ..., n]
2. **Fetch**: Access element at index k-1
3. **Move**: Remove element at k-1 and append to end
4. **Return**: Return the fetched value

### Why It Works

The list naturally maintains order. Accessing index k-1 gives the k-th element. Removing and appending simulates the "most recently used" behavior where accessed elements move to the end.

### Code Implementation

````carousel
```python
class MRUQueue:
    def __init__(self, n: int):
        """
        Initialize the MRU queue with elements [1, 2, ..., n].
        
        Args:
            n: Number of elements to initialize
        """
        # Create queue as [1, 2, 3, ..., n]
        self.queue = list(range(1, n + 1))

    def fetch(self, k: int) -> int:
        """
        Fetch the k-th most recently used element.
        
        Args:
            k: 1-indexed position (k-th element from front)
            
        Returns:
            The value at position k
        """
        # Get element at k-1 (0-indexed)
        val = self.queue[k - 1]
        # Remove from current position
        del self.queue[k - 1]
        # Append to end (most recently used position)
        self.queue.append(val)
        return val
```

<!-- slide -->
```cpp
class MRUQueue {
private:
    vector<int> queue;
    
public:
    MRUQueue(int n) {
        // Initialize queue with [1, 2, ..., n]
        queue.resize(n);
        iota(queue.begin(), queue.end(), 1);
    }
    
    int fetch(int k) {
        // Get element at k-1 (0-indexed)
        int val = queue[k - 1];
        // Remove from current position
        queue.erase(queue.begin() + k - 1);
        // Append to end (most recently used position)
        queue.push_back(val);
        return val;
    }
};
```

<!-- slide -->
```java
class MRUQueue {
    private List<Integer> queue;
    
    public MRUQueue(int n) {
        // Initialize queue with [1, 2, ..., n]
        queue = new ArrayList<>();
        for (int i = 1; i <= n; i++) {
            queue.add(i);
        }
    }
    
    public int fetch(int k) {
        // Get element at k-1 (0-indexed)
        int val = queue.get(k - 1);
        // Remove from current position
        queue.remove(k - 1);
        // Append to end (most recently used position)
        queue.add(val);
        return val;
    }
}
```

<!-- slide -->
```javascript
/**
 * Design Most Recently Used Queue
 */
class MRUQueue {
    /**
     * Initialize the MRU queue with elements [1, 2, ..., n].
     * @param {number} n - Number of elements
     */
    constructor(n) {
        // Create queue as [1, 2, 3, ..., n]
        this.queue = Array.from({length: n}, (_, i) => i + 1);
    }
    
    /**
     * Fetch the k-th most recently used element.
     * @param {number} k - 1-indexed position
     * @return {number} - The value at position k
     */
    fetch(k) {
        // Get element at k-1 (0-indexed)
        const val = this.queue[k - 1];
        // Remove from current position
        this.queue.splice(k - 1, 1);
        // Append to end (most recently used position)
        this.queue.push(val);
        return val;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - List deletion requires shifting elements |
| **Space** | O(n) - Storing n elements |

---

## Approach 2: Optimized Using Fenwick Tree

For better performance with large n and many fetch operations, use a Fenwick Tree (Binary Indexed Tree) to achieve O(log n) per operation.

### Algorithm Steps

1. **Initialize BIT**: Create a Fenwick tree where each index stores 1 (element present)
2. **Find k-th Element**: Use binary search on BIT to find the k-th present element
3. **Mark as Used**: Update BIT to mark the fetched position as 0
4. **Track Position**: Keep track of next available position for appending
5. **Return Value**: Convert index to actual value

### Why It Works

A Fenwick Tree efficiently supports:
- Point updates: Mark element as used (O(log n))
- Prefix sums: Find k-th element by cumulative frequency (O(log nThis allows O(log))

 n) fetch operations instead of O(n).

### Code Implementation

````carousel
```python
class FenwickTree:
    def __init__(self, n: int):
        """Initialize Fenwick Tree with n positions."""
        self.n = n
        self.tree = [0] * (n + 1)
    
    def update(self, i: int, delta: int):
        """Update position i by delta."""
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)
    
    def query(self, i: int) -> int:
        """Get prefix sum from 1 to i."""
        result = 0
        while i > 0:
            result += self.tree[i]
            i -= i & (-i)
        return result
    
    def find_kth(self, k: int) -> int:
        """Find smallest index i where prefix sum >= k."""
        low, high = 1, self.n
        while low < high:
            mid = (low + high) // 2
            if self.query(mid) >= k:
                high = mid
            else:
                low = mid + 1
        return low


class MRUQueue:
    def __init__(self, n: int):
        """Initialize with elements 1 to n."""
        self.n = n
        self.next_pos = n + 1  # Next position for appending
        self.bit = FenwickTree(n + n)  # Extra space for appended elements
        self.values = {}  # index -> value mapping
        
        # Initialize original positions
        for i in range(1, n + 1):
            self.values[i] = i
            self.bit.update(i, 1)
    
    def fetch(self, k: int) -> int:
        """Fetch k-th element and move to end."""
        # Find k-th element's index
        idx = self.bit.find_kth(k)
        
        # Get value at this index
        val = self.values[idx]
        
        # Mark position as empty
        self.bit.update(idx, -1)
        
        # Assign next position to this value
        self.values[self.next_pos] = val
        
        # Mark new position as occupied
        self.bit.update(self.next_pos, 1)
        
        # Increment next position
        self.next_pos += 1
        
        return val
```

<!-- slide -->
```cpp
class FenwickTree {
private:
    vector<int> tree;
    int n;
    
public:
    FenwickTree(int n) : n(n), tree(n + 1, 0) {}
    
    void update(int i, int delta) {
        while (i <= n) {
            tree[i] += delta;
            i += i & (-i);
        }
    }
    
    int query(int i) {
        int result = 0;
        while (i > 0) {
            result += tree[i];
            i -= i & (-i);
        }
        return result;
    }
    
    int findKth(int k) {
        int low = 1, high = n;
        while (low < high) {
            int mid = (low + high) / 2;
            if (query(mid) >= k) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }
};

class MRUQueue {
private:
    int n;
    int nextPos;
    FenwickTree bit;
    unordered_map<int, int> values;
    
public:
    MRUQueue(int n) : n(n), nextPos(n + 1), bit(n + n) {
        for (int i = 1; i <= n; i++) {
            values[i] = i;
            bit.update(i, 1);
        }
    }
    
    int fetch(int k) {
        int idx = bit.findKth(k);
        int val = values[idx];
        bit.update(idx, -1);
        values[nextPos] = val;
        bit.update(nextPos, 1);
        nextPos++;
        return val;
    }
};
```

<!-- slide -->
```java
class FenwickTree {
    private int[] tree;
    private int n;
    
    public FenwickTree(int n) {
        this.n = n;
        this.tree = new int[n + 1];
    }
    
    public void update(int i, int delta) {
        while (i <= n) {
            tree[i] += delta;
            i += i & (-i);
        }
    }
    
    public int query(int i) {
        int result = 0;
        while (i > 0) {
            result += tree[i];
            i -= i & (-i);
        }
        return result;
    }
    
    public int findKth(int k) {
        int low = 1, high = n;
        while (low < high) {
            int mid = (low + high) / 2;
            if (query(mid) >= k) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }
}

class MRUQueue {
    private int n;
    private int nextPos;
    private FenwickTree bit;
    private Map<Integer, Integer> values;
    
    public MRUQueue(int n) {
        this.n = n;
        this.nextPos = n + 1;
        this.bit = new FenwickTree(n + n);
        this.values = new HashMap<>();
        
        for (int i = 1; i <= n; i++) {
            values.put(i, i);
            bit.update(i, 1);
        }
    }
    
    public int fetch(int k) {
        int idx = bit.findKth(k);
        int val = values.get(idx);
        bit.update(idx, -1);
        values.put(nextPos, val);
        bit.update(nextPos, 1);
        nextPos++;
        return val;
    }
}
```

<!-- slide -->
```javascript
class FenwickTree {
    constructor(n) {
        this.n = n;
        this.tree = new Array(n + 1).fill(0);
    }
    
    update(i, delta) {
        while (i <= this.n) {
            this.tree[i] += delta;
            i += i & (-i);
        }
    }
    
    query(i) {
        let result = 0;
        while (i > 0) {
            result += this.tree[i];
            i -= i & (-i);
        }
        return result;
    }
    
    findKth(k) {
        let low = 1, high = this.n;
        while (low < high) {
            const mid = Math.floor((low + high) / 2);
            if (this.query(mid) >= k) {
                high = mid;
            } else {
                low = mid + 1;
            }
        }
        return low;
    }
}

class MRUQueue {
    constructor(n) {
        this.n = n;
        this.nextPos = n + 1;
        this.bit = new FenwickTree(n + n);
        this.values = {};
        
        for (let i = 1; i <= n; i++) {
            this.values[i] = i;
            this.bit.update(i, 1);
        }
    }
    
    fetch(k) {
        const idx = this.bit.findKth(k);
        const val = this.values[idx];
        this.bit.update(idx, -1);
        this.values[this.nextPos] = val;
        this.bit.update(this.nextPos, 1);
        this.nextPos++;
        return val;
    }
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n) - Fenwick tree operations |
| **Space** | O(n) - Storing elements and tree |

---

## Comparison of Approaches

| Aspect | Simple List | Fenwick Tree |
|--------|------------|--------------|
| **Time Complexity** | O(n) | O(log n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | Complex |
| **Best For** | Small n | Large n, many operations |

**Recommendation:** Use simple list for interviews unless explicitly optimized.

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Occasionally asked in interviews
- **Companies**: Meta, Amazon
- **Difficulty**: Medium
- **Concepts**: Data structure design, array manipulation, BIT/Fenwick Tree

### Key Learnings
1. **Array/List Operations**: Understanding insertion and deletion
2. **Data Structure Tradeoffs**: Time vs space complexity
3. **Fenwick Tree**: Advanced data structure for order statistics
4. **Design Patterns**: Class design for API implementation

---

## Related Problems

### Same Pattern (Queue/Array Operations)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Design Circular Queue | [Link](https://leetcode.com/problems/design-circular-queue/) | Medium | Queue with fixed size |
| Design Deque | [Link](https://leetcode.com/problems/design-a-deque-with-circular-operation/) | Medium | Double-ended queue |
| Moving Average from Data Stream | [Link](https://leetcode.com/problems/moving-average-from-data-stream/) | Easy | Queue-based sliding window |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Find Kth Largest Element | [Link](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Medium | Order statistics |
| Kth Largest in Stream | [Link](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Easy | Heap-based |
| Median of Data Stream | [Link](https://leetcode.com/problems/find-median-from-data-stream/) | Hard | Two heaps |

---

## Video Tutorial Links

### Data Structure Design

1. **[MRU Queue - NeetCode](https://www.youtube.com/watch?v=y2kdX2bE7xM)**
   - Explanation of the problem
   - Visual examples

2. **[Fenwick Tree Explained](https://www.youtube.com/watch?v=v0sC4D5f7qM)**
   - Understanding BIT operations
   - Implementation details

3. **[Order Statistics](https://www.youtube.com/watch?v=7A4l8xTxTxs)**
   - Finding k-th element efficiently
   - Advanced variations

---

## Follow-up Questions

### Q1: What is the time complexity of the simple list approach?

**Answer:** O(n) per fetch operation because deleting an element from a list requires shifting all subsequent elements.

---

### Q2: How would you optimize to O(log n) per operation?

**Answer:** Use a Fenwick Tree (Binary Indexed Tree) or Segment Tree to track element positions. These data structures support O(log n) for both finding k-th element and updating positions.

---

### Q3: What if we need to support millions of fetch operations?

**Answer:** The Fenwick Tree approach would be better. Also consider using a balanced BST (like treap) or a linked list with a skip mechanism.

---

### Q4: How does this relate to LRU (Least Recently Used) cache?

**Answer:** MRU is the opposite of LRU. MRU moves accessed elements to the front (most recently used), while LRU moves to the back (least recently used).

---

### Q5: What data structures would you use for real-world MRU implementation?

**Answer:** In production systems, use:
- Doubly linked list with hash map for O(1) operations
- For order statistics: Fenwick Tree, Segment Tree, or balanced BST
- For persistence: B+Tree or LSM Tree

---

### Q6: How would you handle memory constraints?

**Answer:** If memory is limited, consider:
- Circular buffer for fixed-size MRU
- Lazy deletion (mark as deleted without immediate removal)
- Compression for stored values

---

### Q7: What edge cases should be tested?

**Answer:**
- k = 1 (first element)
- k = n (last element)
- Multiple fetches in sequence
- All elements fetched in order
- k after many operations

---

## Common Pitfalls

### 1. Index Off-by-one
**Issue**: Using 0-indexed access with 1-indexed input.

**Solution**: Remember to convert k to index k-1 when accessing list elements.

### 2. List Deletion Performance
**Issue**: Deleting from middle of list is O(n).

**Solution**: Accept O(n) complexity or use more complex data structures like linked list or BIT.

### 3. Not Updating Position After Fetch
**Issue**: Forgetting to move fetched element to end.

**Solution**: Always append the fetched element to the end of the list.

### 4. Incorrect Initial State
**Issue**: Starting queue incorrectly.

**Solution**: Initialize with [1, 2, ..., n] in order.

---

## Summary

The **Design Most Recently Used Queue** problem demonstrates:

1. **Array/List Manipulation**: Basic operations on dynamic arrays
2. **Data Structure Design**: Creating APIs with specific behaviors
3. **Complexity Tradeoffs**: Simple O(n) vs optimized O(log n) solutions
4. **Advanced Structures**: Fenwick Tree for order statistics

The simple list approach is sufficient for most interviews. The Fenwick Tree optimization demonstrates knowledge of advanced data structures for production-level performance.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-the-winner-of-the-game/discuss/) - Community solutions
- [Fenwick Tree - GeeksforGeeks](https://www.geeksforgeeks.org/binary-indexed-tree-fenwick-tree/) - Comprehensive guide
- [Order Statistics Tree](https://en.wikipedia.org/wiki/Order_statistic_tree) - Advanced concepts
