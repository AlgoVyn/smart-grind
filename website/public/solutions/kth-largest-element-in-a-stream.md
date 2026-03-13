# Kth Largest Element in a Stream

## Problem Description

Design a class to find the kth largest element in a stream. Note that it is the kth largest element in the sorted order, not the kth distinct element.

Implement `KthLargest` class:

- `KthLargest(int k, int[] nums)` Initializes the object with the integer `k` and the stream of integers `nums`.
- `int add(int val)` Appends the integer `val` to the stream and returns the element representing the kth largest element in the stream.

**Link to problem:** [Kth Largest Element in a Stream - LeetCode 703](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

---

## Pattern: Min-Heap for Kth Largest

This problem demonstrates the **Heap - Top K Elements** pattern. The key is using a min-heap of size k to efficiently find the kth largest element.

### Core Concept

The fundamental idea is maintaining a min-heap of size k:
- The heap always contains the k largest elements seen so far
- The root (minimum) of the heap is the kth largest element
- When heap exceeds size k, remove the smallest

---

## Examples

### Example

**Input:**
```
["KthLargest", "add", "add", "add", "add", "add"]
[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
```

**Output:**
```
[null, 4, 5, 5, 8, 8]
```

---

## Constraints

- `1 <= k <= 10^5`
- `0 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`
- `-10^4 <= val <= 10^4`
- At most `10^4` calls will be made to `add`.

---

## Intuition

The key insight is using a min-heap of size k:
- We only need to track the k largest elements
- The smallest element in our heap is the kth largest overall
- Adding a new element: push to heap, if size > k, pop smallest

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Min-Heap (Optimal)** - O(log k) per operation
2. **Balanced BST** - O(log n) per operation

---

## Approach 1: Min-Heap (Optimal)

This is the standard and most efficient approach.

### Algorithm Steps

1. Initialize a min-heap with the first k elements (or all if less than k)
2. For each `add(val)`:
   - Add val to heap
   - If heap size > k, pop smallest
   - Return heap root (kth largest)

### Code Implementation

````carousel
```python
import heapq
from typing import List

class KthLargest:

    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.heap = []
        
        # Initialize heap with first k elements
        for num in nums:
            heapq.heappush(self.heap, num)
            if len(self.heap) > k:
                heapq.heappop(self.heap)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]
```

<!-- slide -->
```cpp
class KthLargest {
private:
    int k;
    priority_queue<int, vector<int>, greater<int>> minHeap;
    
public:
    KthLargest(int k, vector<int>& nums) {
        this->k = k;
        for (int num : nums) {
            minHeap.push(num);
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }
    }
    
    int add(int val) {
        minHeap.push(val);
        if (minHeap.size() > k) {
            minHeap.pop();
        }
        return minHeap.top();
    }
};
```

<!-- slide -->
```java
class KthLargest {
    private int k;
    private PriorityQueue<Integer> minHeap;
    
    public KthLargest(int k, int[] nums) {
        this.k = k;
        minHeap = new PriorityQueue<>();
        for (int num : nums) {
            minHeap.add(num);
            if (minHeap.size() > k) {
                minHeap.poll();
            }
        }
    }
    
    public int add(int val) {
        minHeap.add(val);
        if (minHeap.size() > k) {
            minHeap.poll();
        }
        return minHeap.peek();
    }
}
```

<!-- slide -->
```javascript
var KthLargest = function(k, nums) {
    this.k = k;
    this.heap = [];
    
    // Initialize heap with first k elements
    for (const num of nums) {
        this.heap.push(num);
        this.heap.sort((a, b) => a - b);
        if (this.heap.length > k) {
            this.heap.shift();
        }
    }
};

KthLargest.prototype.add = function(val) {
    this.heap.push(val);
    this.heap.sort((a, b) => a - b);
    if (this.heap.length > this.k) {
        this.heap.shift();
    }
    return this.heap[0];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) initialization + O(log k) per add |
| **Space** | O(k) |

---

## Approach 2: Balanced BST

Using a TreeMap or similar data structure.

### Code Implementation

````carousel
```python
from sortedcontainers import SortedList
from typing import List

class KthLargest:

    def __init__(self, k: int, nums: List[int]):
        self.k = k
        self.sorted_list = SortedList(nums)

    def add(self, val: int) -> int:
        self.sorted_list.add(val)
        # kth largest is at index len - k
        return self.sorted_list[len(self.sorted_list) - self.k]
```

<!-- slide -->
```cpp
class KthLargest {
private:
    int k;
    multiset<int> ms;
    
public:
    KthLargest(int k, vector<int>& nums) {
        this->k = k;
        for (int num : nums) {
            ms.insert(num);
        }
    }
    
    int add(int val) {
        ms.insert(val);
        auto it = ms.end();
        advance(it, -k);
        return *it;
    }
};
```

<!-- slide -->
```java
class KthLargest {
    private int k;
    private TreeMap<Integer, Integer> tm;
    private int size;
    
    public KthLargest(int k, int[] nums) {
        this.k = k;
        tm = new TreeMap<>();
        for (int num : nums) {
            tm.put(num, tm.getOrDefault(num, 0) + 1);
        }
        size = nums.length;
    }
    
    public int add(int val) {
        tm.put(val, tm.getOrDefault(val, 0) + 1);
        size++;
        
        // Get kth largest
        int count = 0;
        for (int key : tm.descendingKeySet()) {
            count += tm.get(key);
            if (count >= k) {
                return key;
            }
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
// JavaScript doesn't have built-in TreeMap, would need external library
// Using simple array approach for demonstration
var KthLargest = function(k, nums) {
    this.k = k;
    this.nums = nums.sort((a, b) => a - b);
};

KthLargest.prototype.add = function(val) {
    // Binary insert
    let lo = 0, hi = this.nums.length;
    while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (this.nums[mid] < val) lo = mid + 1;
        else hi = mid;
    }
    this.nums.splice(lo, 0, val);
    return this.nums[this.nums.length - this.k];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) + O(log n) per add |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Min-Heap | Balanced BST |
|--------|----------|--------------|
| **Time** | O(log k) per add | O(log n) per add |
| **Space** | O(k) | O(n) |
| **Implementation** | Simple | More complex |

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Kth Largest Element in an Array | [Link](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Similar problem |
| Top K Frequent Elements | [Link](https://leetcode.com/problems/top-k-frequent-elements/) | Uses heap |

---

## Video Tutorial Links

- [NeetCode - Kth Largest Element in a Stream](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Clear explanation
- [Heap Fundamentals](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Understanding heaps

---

## Follow-up Questions

### Q1: Why use min-heap instead of max-heap?

**Answer:** With a min-heap of size k, the root is always the smallest among the k largest elements - which is exactly the kth largest we need.

---

### Q2: How would you handle duplicate values?

**Answer:** The heap naturally handles duplicates. If you need distinct kth largest, you'd need a different approach.

---

## Common Pitfalls

### 1. Heap Size
**Issue**: Not maintaining heap size at k.

**Solution**: After each insertion, check if heap size exceeds k and pop the smallest.

### 2. Initial Population
**Issue**: Not populating heap with initial nums.

**Solution**: Initialize heap with first k elements from nums during construction.

### 3. Empty Heap
**Issue**: Trying to access heap[0] when heap is empty.

**Solution**: Always ensure heap has at least k elements before returning root.

### 4. Return Value
**Issue**: Returning wrong element (not the kth largest).

**Solution**: The root of min-heap of size k is always the kth largest element.

---

## Summary

The **Kth Largest Element in a Stream** problem demonstrates the heap pattern:
- Use min-heap of size k
- Add new element, pop if size exceeds k
- Return heap root for kth largest
- O(log k) per operation

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/kth-largest-element-in-a-stream/discuss/)
