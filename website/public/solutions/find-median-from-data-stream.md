# Find Median From Data Stream

## Problem Description

The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.

For example, for arr = [2,3,4], the median is 3.
For example, for arr = [2,3], the median is (2 + 3) / 2 = 2.5.

Implement the MedianFinder class:

- `MedianFinder()` initializes the MedianFinder object.
- `void addNum(int num)` adds the integer num from the data stream to the data structure.
- `double findMedian()` returns the median of all elements so far. Answers within 10^-5 of the actual answer will be accepted.

## Examples

**Example 1:**

**Input:**
```python
["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"]
[[], [1], [2], [], [3], []]
```

**Output:**
```python
[null, null, null, 1.5, null, 2.0]
```

**Explanation:**
```python
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

## Constraints

- -10^5 <= num <= 10^5
- There will be at least one element in the data structure before calling `findMedian`.
- At most 5 * 10^4 calls will be made to `addNum` and `findMedian`.

#

## Pattern:

This problem follows the **Two Heaps** pattern.

### Core Concept

- **Two Heaps**: Max heap for lower half, min heap for upper half
- **Balance**: Keep heaps balanced for median
- **O(log n)**: Insert and find median in log time

### When to Use This Pattern

This pattern is applicable when:
1. Median of streaming data
2. Running median problems
3. Two heap balancing

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Heap | Data structure |
| Balanced BST | Alternative approach |

---

## Follow up

If all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?
If 99% of all integer numbers from the stream are in the range [0, 100], how would you optimize your solution?

---

## Intuition

The key to efficiently finding the median in a stream is to maintain a balanced split of the data. We use two heaps:

- **Max-heap for lower half**: Contains the smaller half of the numbers
- **Min-heap for upper half**: Contains the larger half of the numbers

This allows O(1) median retrieval and O(log n) insertion.

### Why Two Heaps Work

1. The max-heap always has the largest element of the smaller half
2. The min-heap always has the smallest element of the larger half
3. If both heaps have equal size, median is average of tops
4. If one heap has more, median is the top of the larger heap

---

## Multiple Approaches with Code

We'll cover three approaches:
1. **Two Heaps (Optimal)** - O(log n) add, O(1) median
2. **Balanced BST** - Alternative data structure approach
3. **Array with Binary Search** - Simpler but less efficient

---

## Approach 1: Two Heaps (Optimal)

This is the most efficient and commonly used approach.

### Algorithm Steps

1. Maintain two heaps:
   - `small`: max-heap (store negated values) for lower half
   - `large`: min-heap for upper half
2. In `addNum(num)`:
   - Push to max-heap first
   - Transfer top to min-heap
   - Rebalance if needed (max-heap can have at most 1 more element)
3. In `findMedian()`:
   - If heaps equal size: return average
   - If max-heap larger: return its top

### Why It Works

The heaps are kept balanced with at most 1 element difference. The max-heap gives us quick access to the largest of the smaller half, and the min-heap gives us quick access to the smallest of the larger half.

### Code Implementation

````carousel
```python
import heapq
from typing import Optional

class MedianFinder:
    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.small = []  # max-heap for lower half (store negated)
        self.large = []  # min-heap for upper half

    def addNum(self, num: int) -> None:
        """
        Adds a num into the data structure.
        
        Args:
            num: Integer to add to the data stream
        """
        # Push to max-heap (negate for max behavior)
        heapq.heappush(self.small, -num)
        
        # Balance: move largest from small to large
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        # Ensure small has >= elements than large
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        """
        Returns the median of current data stream.
        
        Returns:
            Median of all elements added so far
        """
        if len(self.small) > len(self.large):
            return float(-self.small[0])
        else:
            return (-self.small[0] + self.large[0]) / 2
```

<!-- slide -->
```cpp
#include <queue>

class MedianFinder {
private:
    // Max-heap for lower half (store negated values)
    priority_queue<int> small;
    // Min-heap for upper half
    priority_queue<int, vector<int>, greater<int>> large;
    
public:
    /** initialize your data structure here. */
    MedianFinder() {
        
    }
    
    /**
     * Adds a num into the data structure.
     * 
     * @param num - Integer to add to the data stream
     */
    void addNum(int num) {
        // Push to max-heap
        small.push(num);
        
        // Balance: move largest from small to large
        large.push(small.top());
        small.pop();
        
        // Ensure small has >= elements than large
        if (large.size() > small.size()) {
            small.push(large.top());
            large.pop();
        }
    }
    
    /**
     * Returns the median of current data stream.
     * 
     * @return Median of all elements added so far
     */
    double findMedian() {
        if (small.size() > large.size()) {
            return small.top();
        } else {
            return (small.top() + large.top()) / 2.0;
        }
    }
};
```

<!-- slide -->
```java
import java.util.*;

class MedianFinder {
    // Max-heap for lower half
    private Queue<Integer> small;
    // Min-heap for upper half
    private Queue<Integer> large;
    
    /** initialize your data structure here. */
    public MedianFinder() {
        small = new PriorityQueue<>(Collections.reverseOrder());
        large = new PriorityQueue<>();
    }
    
    /**
     * Adds a num into the data structure.
     * 
     * @param num - Integer to add to the data stream
     */
    public void addNum(int num) {
        // Push to max-heap
        small.offer(num);
        
        // Balance: move largest from small to large
        large.offer(small.poll());
        
        // Ensure small has >= elements than large
        if (large.size() > small.size()) {
            small.offer(large.poll());
        }
    }
    
    /**
     * Returns the median of current data stream.
     * 
     * @return Median of all elements added so far
     */
    public double findMedian() {
        if (small.size() > large.size()) {
            return (double) small.peek();
        } else {
            return (small.peek() + large.peek()) / 2.0;
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * initialize your data structure here.
 */
class MedianFinder {
    constructor() {
        // Max-heap for lower half (store negated)
        this.small = [];
        // Min-heap for upper half
        this.large = [];
    }
    
    /**
     * @param {number} num
     * @return {void}
     */
    addNum(num) {
        // Push to max-heap (negate for max behavior)
        this._heapPush(this.small, -num, 'max');
        
        // Balance: move largest from small to large
        const moved = this._heapPop(this.small, 'max');
        this._heapPush(this.large, -moved, 'min');
        
        // Ensure small has >= elements than large
        if (this.large.length > this.small.length) {
            const movedBack = this._heapPop(this.large, 'min');
            this._heapPush(this.small, movedBack, 'max');
        }
    }
    
    /**
     * @return {number}
     */
    findMedian() {
        if (this.small.length > this.large.length) {
            return -this.small[0];
        } else {
            return (-this.small[0] + this.large[0]) / 2;
        }
    }
    
    // Simple heap implementation for JavaScript
    _heapPush(heap, val, type) {
        heap.push(val);
        heap.bubbleUp = function(i) {
            while (i > 0) {
                const parent = Math.floor((i - 1) / 2);
                if (type === 'max' && heap[i] <= heap[parent]) break;
                if (type === 'min' && heap[i] >= heap[parent]) break;
                [heap[i], heap[parent]] = [heap[parent], heap[i]];
                i = parent;
            }
        };
        heap.bubbleUp(heap.length - 1);
    }
    
    _heapPop(heap, type) {
        const result = heap[0];
        const last = heap.pop();
        if (heap.length > 0) {
            heap[0] = last;
            heap.bubbleDown = function(i) {
                while (true) {
                    let smallest = i;
                    const left = 2 * i + 1;
                    const right = 2 * i + 2;
                    if (left < heap.length && 
                        (type === 'max' ? heap[left] > heap[smallest] : heap[left] < heap[smallest])) {
                        smallest = left;
                    }
                    if (right < heap.length && 
                        (type === 'max' ? heap[right] > heap[smallest] : heap[right] < heap[smallest])) {
                        smallest = right;
                    }
                    if (smallest === i) break;
                    [heap[i], heap[smallest]] = [heap[smallest], heap[i]];
                    i = smallest;
                }
            };
            heap.bubbleDown(0);
        }
        return result;
    }
}
```
````

### Complexity Analysis

| Complexity | addNum | findMedian |
|------------|--------|------------|
| **Time** | O(log n) | O(1) |
| **Space** | O(n) | O(1) |

---

## Approach 2: Balanced BST (Alternative)

Using a balanced binary search tree to maintain sorted order.

### Algorithm Steps

1. Use a TreeMap or balanced BST to store all numbers
2. In `addNum(num)`:
   - Insert into the BST (O(log n))
3. In `findMedian()`:
   - Find the middle element(s) (O(log n))
   - Calculate median

### Why It Works

A BST maintains elements in sorted order. We can efficiently find the median by navigating to the middle element(s).

### Code Implementation

````carousel
```python
from sortedcontainers import SortedList

class MedianFinder:
    def __init__(self):
        """
        Initialize your data structure here.
        """
        self.data = SortedList()

    def addNum(self, num: int) -> None:
        """
        Adds a num into the data structure.
        """
        self.data.add(num)

    def findMedian(self) -> float:
        """
        Returns the median of current data stream.
        """
        n = len(self.data)
        if n % 2 == 1:
            return float(self.data[n // 2])
        else:
            return (self.data[n // 2 - 1] + self.data[n // 2]) / 2
```

<!-- slide -->
```cpp
#include <map>

class MedianFinder {
private:
    std::multiset<int> data;
    std::multiset<int>::iterator mid;
    
public:
    MedianFinder() {
        
    }
    
    void addNum(int num) {
        data.insert(num);
        
        if (data.size() == 1) {
            mid = data.begin();
        } else {
            if (num < *mid) {
                if (data.size() % 2 == 0) {
                    mid--;
                }
            } else {
                if (data.size() % 2 == 1) {
                    mid++;
                }
            }
        }
    }
    
    double findMedian() {
        if (data.size() % 2 == 1) {
            return *mid;
        } else {
            auto it = mid;
            it--;
            return (*it + *mid) / 2.0;
        }
    }
};
```

<!-- slide -->
```java
import java.util.TreeMap;

class MedianFinder {
    private TreeMap<Integer, Integer> data;
    private int size;
    private Integer midKey;
    
    public MedianFinder() {
        data = new TreeMap<>();
        size = 0;
    }
    
    public void addNum(int num) {
        data.put(num, data.getOrDefault(num, 0) + 1);
        size++;
        
        if (midKey == null) {
            midKey = num;
        } else {
            if (num < midKey) {
                if (size % 2 == 0) {
                    // Need to move midKey to previous
                    midKey = data.lowerKey(midKey);
                }
            } else {
                if (size % 2 == 1) {
                    midKey = data.higherKey(midKey);
                }
            }
        }
    }
    
    public double findMedian() {
        int count = data.get(midKey);
        
        if (size % 2 == 1) {
            return midKey;
        } else {
            Integer lowerKey = data.lowerKey(midKey);
            if (lowerKey == null) {
                return midKey;
            }
            return (midKey + lowerKey) / 2.0;
        }
    }
}
```

<!-- slide -->
```javascript
class MedianFinder {
    constructor() {
        this.data = [];
    }
    
    addNum(num) {
        // Binary insertion
        let left = 0, right = this.data.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (this.data[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        this.data.splice(left, 0, num);
    }
    
    findMedian() {
        const n = this.data.length;
        if (n % 2 === 1) {
            return this.data[Math.floor(n / 2)];
        } else {
            return (this.data[n / 2 - 1] + this.data[n / 2]) / 2;
        }
    }
}
```
````

### Complexity Analysis

| Complexity | addNum | findMedian |
|------------|--------|------------|
| **Time** | O(log n) | O(log n) or O(n)* |
| **Space** | O(n) | O(1) |

*JavaScript array implementation is O(n) for insertion.

---

## Approach 3: Counting Sort (Optimized for Limited Range)

When numbers are in a fixed range, use counting array.

### Algorithm Steps

1. Use an array of size 101 (for 0-100 range) to count frequencies
2. In `addNum(num)`:
   - Increment count at index num
3. In `findMedian()`:
   - Traverse counting array to find median position

### Why It Works

When values are bounded, counting sort gives O(1) insertion and O(1) median retrieval (constant range traversal).

### Code Implementation

````carousel
```python
class MedianFinder:
    def __init__(self):
        """
        Initialize your data structure here.
        For range [0, 100]
        """
        self.count = [0] * 101
        self.total = 0

    def addNum(self, num: int) -> None:
        """
        Adds a num into the data structure.
        """
        self.count[num] += 1
        self.total += 1

    def findMedian(self) -> float:
        """
        Returns the median of current data stream.
        """
        target = (self.total + 1) // 2 if self.total % 2 == 1 else self.total // 2
        
        running = 0
        for i in range(101):
            running += self.count[i]
            if running >= target:
                # Odd case or first of even pair
                if self.total % 2 == 1:
                    return float(i)
                # Need to find the next element for even case
                if running == target:
                    # Find next non-zero
                    for j in range(i + 1, 101):
                        if self.count[j] > 0:
                            return (i + j) / 2
                return float(i)
        
        return 0.0
```

<!-- slide -->
```cpp
class MedianFinder {
private:
    // For range [0, 100]
    int count[101];
    int total;
    
public:
    MedianFinder() {
        memset(count, 0, sizeof(count));
        total = 0;
    }
    
    void addNum(int num) {
        count[num]++;
        total++;
    }
    
    double findMedian() {
        int target = (total + 1) / 2;
        
        int running = 0;
        for (int i = 0; i <= 100; i++) {
            running += count[i];
            if (running >= target) {
                if (total % 2 == 1) {
                    return i;
                }
                if (running == target) {
                    for (int j = i + 1; j <= 100; j++) {
                        if (count[j] > 0) {
                            return (i + j) / 2.0;
                        }
                    }
                }
                // Find previous
                for (int j = i - 1; j >= 0; j--) {
                    if (count[j] > 0) {
                        return (i + j) / 2.0;
                    }
                }
            }
        }
        return 0.0;
    }
};
```

<!-- slide -->
```java
class MedianFinder {
    // For range [0, 100]
    private int[] count;
    private int total;
    
    public MedianFinder() {
        count = new int[101];
        total = 0;
    }
    
    public void addNum(int num) {
        count[num]++;
        total++;
    }
    
    public double findMedian() {
        int target = (total + 1) / 2;
        
        int running = 0;
        for (int i = 0; i <= 100; i++) {
            running += count[i];
            if (running >= target) {
                if (total % 2 == 1) {
                    return i;
                }
                if (running == target) {
                    for (int j = i + 1; j <= 100; j++) {
                        if (count[j] > 0) {
                            return (i + j) / 2.0;
                        }
                    }
                }
                for (int j = i - 1; j >= 0; j--) {
                    if (count[j] > 0) {
                        return (i + j) / 2.0;
                    }
                }
            }
        }
        return 0.0;
    }
}
```

<!-- slide -->
```javascript
class MedianFinder {
    constructor() {
        // For range [0, 100]
        this.count = new Array(101).fill(0);
        this.total = 0;
    }
    
    addNum(num) {
        this.count[num]++;
        this.total++;
    }
    
    findMedian() {
        const target = Math.floor((this.total + 1) / 2);
        
        let running = 0;
        for (let i = 0; i <= 100; i++) {
            running += this.count[i];
            if (running >= target) {
                if (this.total % 2 === 1) {
                    return i;
                }
                if (running === target) {
                    for (let j = i + 1; j <= 100; j++) {
                        if (this.count[j] > 0) {
                            return (i + j) / 2;
                        }
                    }
                }
                for (let j = i - 1; j >= 0; j--) {
                    if (this.count[j] > 0) {
                        return (i + j) / 2;
                    }
                }
            }
        }
        return 0;
    }
}
```
````

### Complexity Analysis

| Complexity | addNum | findMedian |
|------------|--------|------------|
| **Time** | O(1) | O(100) = O(1) |
| **Space** | O(101) = O(1) | O(1) |

---

## Comparison of Approaches

| Aspect | Two Heaps | Balanced BST | Counting Sort |
|--------|-----------|--------------|---------------|
| **addNum** | O(log n) | O(log n) | O(1) |
| **findMedian** | O(1) | O(log n) | O(1) |
| **Space** | O(n) | O(n) | O(1) |
| **Best For** | General case | Need ordering info | Limited range |

**Best Approach:** Two heaps is optimal for the general case.

---

## Why Two Heaps is Optimal

The two-heap approach is optimal because:

1. **Fast Insertion**: O(log n) using heap operations
2. **Instant Median**: O(1) by looking at heap tops
3. **Balanced**: Size difference never exceeds 1
4. **Simple**: Easy to understand and implement
5. **Industry Standard**: Widely used solution

---

## Related Problems

Based on similar themes (heaps, data streams, ordering):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Kth Largest Element in a Stream | [Link](https://leetcode.com/problems/kth-largest-element-in-a-stream/) | Using min-heap |
| Moving Average from Data Stream | [Link](https://leetcode.com/problems/moving-average-from-data-stream/) | Using queue |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sliding Window Median | [Link](https://leetcode.com/problems/sliding-window-median/) | Median in sliding window |
| Find Median from Data Stream | [Link](https://leetcode.com/problems/find-median-from-data-stream/) | This problem |
| Array Nearest Element | [Link](https://leetcode.com/problems/find-nearest-right-interval/) | Similar pattern |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Median of Two Sorted Arrays | [Link](https://leetcode.com/problems/median-of-two-sorted-arrays/) | Harder version |
| Max Stack | [Link](https://leetcode.com/problems/max-stack/) | Stack with max tracking |

---

## Video Tutorial Links

### Two Heaps Technique

- [NeetCode - Find Median from Data Stream](https://www.youtube.com/watch?v=itmhHWaH6kA) - Clear explanation
- [Two Heaps Explanation](https://www.youtube.com/watch?v=Ds3YIZM3u8E) - Visual examples
- [LeetCode Official Solution](https://www.youtube.com/watch?v=cwKj6OTkCoM) - Official solution

### Alternative Approaches

- [Balanced BST Approach](https://www.youtube.com/watch?v=1wQ6f5j7ZPk) - TreeMap solution
- [Counting Sort Optimization](https://www.youtube.com/watch?v=7F_q6H2O-Mg) - Limited range optimization

---

## Follow-up Questions

### Q1: How would you optimize if all numbers are in range [0, 100]?

**Answer:** Use counting array (approach 3). This gives O(1) for both addNum and findMedian. For 99% in range, use a hybrid: counting array for the common range, and balanced BST or heaps for outliers.

---

### Q2: How would you find the mode (most frequent element) in the stream?

**Answer:** Add a hash map to track frequencies. When adding, update frequency and track the maximum. For ties, decide on tie-breaking strategy (smallest/largest value).

---

### Q3: Can you implement it with only one heap?

**Answer:** You could use a balanced BST-like structure, but two heaps is cleaner. With one heap, you'd need to keep it sorted, which requires O(n) to rebalance instead of O(log n).

---

### Q4: How would you handle thread safety?

**Answer:** Add locks/mutex around heap operations. In Python, use threading.Lock. In Java, use synchronized blocks or ReentrantLock. This adds overhead but maintains correctness.

---

### Q5: How would you serialize and deserialize the MedianFinder?

**Answer:** Store both heaps as sorted lists. For deserialization, rebuild heaps by inserting elements in order. Can also store a sorted list and compute median directly.

---

### Q6: What if you need the median of each sliding window of size k?

**Answer:** This is the "Sliding Window Median" problem. Use two heaps with lazy deletion (mark elements as removed rather than immediately removing) and maintain a window of k elements.

---

### Q7: How would you handle very large numbers?

**Answer:** Use long/bigint types. Python int handles arbitrary precision automatically. For language-specific solutions, use appropriate numeric types to avoid overflow.

---

## Common Pitfalls

### 1. Heap Types
**Issue**: Confusing max-heap and min-heap.

**Solution**: In Python, use negative values for max-heap. In C++ and Java, use appropriate comparator.

### 2. Balance Condition
**Issue**: Not maintaining heap balance correctly.

**Solution**: After each add, ensure small.size() >= large.size() and the difference is at most 1.

### 3. Float Division
**Issue**: Integer division in Python 2 or wrong type.

**Solution**: Use /2.0 or cast to float explicitly.

### 4. Empty Heaps
**Issue**: Accessing heap tops when empty.

**Solution**: Check heap sizes before calling findMedian (problem guarantees at least 1 element).

---

## Summary

The **Find Median from Data Stream** problem demonstrates the power of data structure design:

- **Two Heaps**: Optimal O(log n) add, O(1) median
- **Balanced BST**: Alternative with O(log n) operations
- **Counting Sort**: O(1) for bounded ranges

The key insight is using two heaps to maintain a balanced split of the data, allowing constant-time median retrieval.

This problem is an excellent demonstration of how the right data structure choice leads to optimal algorithmic performance.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-median-from-data-stream/discuss/) - Community solutions
- [Heap Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/heap-data-structure/) - Heap explanation
- [Priority Queue - Python](https://docs.python.org/3/library/heapq.html) - Python heapq documentation
