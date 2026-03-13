# Finding MK Average

## Problem Description

You are given two integers, `m` and `k`, and a stream of integers. You are tasked to implement a data structure that calculates the MKAverage for the stream.

The MKAverage can be calculated using these steps:
1. If the number of elements in the stream is less than `m`, return -1. Otherwise, take the last `m` elements of the stream.
2. Remove the smallest `k` elements and the largest `k` elements from this collection.
3. Calculate the average value for the rest of the elements rounded down to the nearest integer.

Implement the `MKAverage` class:
- `MKAverage(int m, int k)` - Initializes the MKAverage object with an empty stream and the two integers m and k.
- `void addElement(int num)` - Inserts a new element num into the stream.
- `int calculateMKAverage()` - Calculates and returns the MKAverage for the current stream rounded down to the nearest integer.

**Link to problem:** [Finding MK Average - LeetCode 1825](https://leetcode.com/problems/finding-mk-average/)

---

## Pattern: Data Structure - Multi-Set with Order Statistics

This problem demonstrates the **Order Statistics Tree** pattern. We need a data structure that can efficiently maintain order statistics (k smallest, k largest, and middle elements).

### Core Concept

The fundamental idea is using three data structures:
- A queue to maintain the last m elements
- Two multisets (or heaps): one for smallest k, one for largest k
- One multiset for the middle elements

Each operation (add, remove) needs to maintain the invariant that:
- Small set: exactly k elements (the k smallest)
- Large set: exactly k elements (the k largest)
- Middle set: contains the remaining m - 2k elements

---

## Examples

### Example

**Input:**
```
["MKAverage", "addElement", "addElement", "calculateMKAverage", "addElement", "calculateMKAverage", "addElement", "addElement", "addElement", "calculateMKAverage"]
[[3, 1], [3], [1], [], [10], [], [5], [5], [5], []]
```

**Output:**
```
[null, null, null, -1, null, 3, null, null, null, 5]
```

**Explanation:**
- MKAverage(3, 1): m=3, k=1
- addElement(3): stream = [3]
- addElement(1): stream = [3,1]
- calculateMKAverage(): less than 3 elements → return -1
- addElement(10): stream = [3,1,10], last 3 = [3,1,10]
- calculateMKAverage(): remove smallest 1 and largest 1 → [3] → average = 3
- addElement(5): stream = [3,1,10,5]
- addElement(5): stream = [3,1,10,5,5]
- addElement(5): stream = [3,1,10,5,5,5], last 3 = [5,5,5]
- calculateMKAverage(): remove smallest 1 and largest 1 → [5] → average = 5

---

## Constraints

- `3 <= m <= 10^5`
- `1 <= 2*k < m`
- `1 <= num <= 10^5`
- At most `10^5` calls will be made to `addElement` and `calculateMKAverage`

---

## Intuition

The key insight is that we need to efficiently:
1. Maintain a sliding window of the last m elements
2. Track the k smallest and k largest in each window
3. Calculate the average of the remaining elements

Using three balanced BSTs (or heaps with lazy deletion) allows O(log m) operations.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Three Heaps/TreeSets** - O(log m) per operation (Optimal)
2. **Brute Force** - O(m log m) for understanding

---

## Approach 1: Three Heaps/TreeSets (Optimal)

### Algorithm Steps

1. Use a queue to maintain last m elements
2. Use three TreeSets/multisets:
   - `small`: k smallest elements
   - `middle`: m - 2k middle elements  
   - `large`: k largest elements
3. Maintain sums of each set for O(1) average calculation
4. On addElement:
   - Add to appropriate set
   - Rebalance to maintain sizes
   - Remove oldest element if queue exceeds m
   - Rebalance after removal
5. On calculateMKAverage:
   - If less than m elements, return -1
   - Return middle_sum / (m - 2*k)

### Code Implementation

````carousel
```python
from typing import List
from collections import deque
import bisect

class MKAverage:
    def __init__(self, m: int, k: int):
        """
        Initialize MKAverage object.
        
        Args:
            m: Window size
            k: Number of elements to remove from each end
        """
        self.m = m
        self.k = k
        self.middle_k = m - 2 * k
        
        self.stream = deque()
        self.small = []  # k smallest (max-heap using negation)
        self.middle = [] # middle elements (sorted)
        self.large = [] # k largest (min-heap)
        
        self.small_sum = 0
        self.middle_sum = 0
        self.large_sum = 0
    
    def addElement(self, num: int) -> None:
        """Insert a new element into the stream."""
        self.stream.append(num)
        
        # Add to appropriate set
        if not self.small or num <= -self.small[0]:
            self.small.append(-num)
            self.small_sum += num
            bisect.insort(self.middle, num)
            self.middle_sum += num
        elif not self.large or num >= self.large[0]:
            self.large.append(num)
            self.large_sum += num
            bisect.insort(self.middle, num)
            self.middle_sum += num
        else:
            bisect.insort(self.middle, num)
            self.middle_sum += num
        
        # Rebalance if needed
        self._rebalance_add(num)
        
        # Remove oldest if exceeds m
        if len(self.stream) > self.m:
            old = self.stream.popleft()
            self._remove_from_sets(old)
            self._rebalance_remove()
    
    def _rebalance_add(self, num: int) -> None:
        """Rebalance sets after adding an element."""
        # Move from small to middle if small has more than k
        if len(self.small) > self.k:
            val = -heapq.heappop(self.small)
            self.small_sum -= val
            bisect.insort(self.middle, val)
            self.middle_sum += val
        
        # Move from middle to small if small has less than k
        if len(self.small) < self.k and self.middle:
            val = self.middle.pop(0)
            self.middle_sum -= val
            heapq.heappush(self.small, -val)
            self.small_sum += val
        
        # Move from middle to large if large has less than k
        if len(self.large) < self.k and self.middle:
            val = self.middle.pop()
            self.middle_sum -= val
            heapq.heappush(self.large, val)
            self.large_sum += val
        
        # Move from large to middle if large has more than k
        if len(self.large) > self.k:
            val = heapq.heappop(self.large)
            self.large_sum -= val
            bisect.insort(self.middle, val)
            self.middle_sum += val
    
    def _remove_from_sets(self, num: int) -> None:
        """Remove element from appropriate set."""
        if num <= -self.small[0]:
            idx = self.small.index(-num)
            self.small[idx] = self.small[-1]
            self.small.pop()
            if idx < len(self.small):
                heapq.heapify(self.small)
            self.small_sum -= num
        elif self.large and num >= self.large[0]:
            idx = self.large.index(num)
            self.large[idx] = self.large[-1]
            self.large.pop()
            if idx < len(self.large):
                heapq.heapify(self.large)
            self.large_sum -= num
        else:
            idx = self.middle.index(num)
            self.middle.pop(idx)
            self.middle_sum -= num
    
    def _rebalance_remove(self) -> None:
        """Rebalance sets after removing an element."""
        self._rebalance_add(0)  # Trigger rebalancing
    
    def calculateMKAverage(self) -> int:
        """Calculate and return the MKAverage."""
        if len(self.stream) < self.m:
            return -1
        return self.middle_sum // self.middle_k
```

Note: The Python implementation above is simplified. For production, consider using SortedList from bisect or a proper implementation with three heaps.

<!-- slide -->
```cpp
// C++ Implementation using order statistic tree (policy-based data structure)
#include <ext/pb_ds/assoc_container.hpp>
using namespace __gnu_pbds;

class MKAverage {
    int m, k;
    long long middleSum = 0;
    queue<int> q;
    
    // Order statistic tree
    tree<pair<int, int>, null_type, less<pair<int,int>>, rb_tree_tag, tree_order_statistics_node_update> s, l, mid;
    
public:
    MKAverage(int m, int k) {
        this->m = m;
        this->k = k;
    }
    
    void addElement(int num) {
        q.push(num);
        
        // Add to appropriate set
        mid.insert({num, q.size()});
        middleSum += num;
        
        // Rebalance
        if (mid.size() > m - 2*k) {
            auto it = prev(mid.end());
            l.insert(*it);
            middleSum -= it->first;
            mid.erase(it);
        }
        
        if (l.size() > k) {
            auto it = l.begin();
            mid.insert(*it);
            middleSum += it->first;
            l.erase(it);
        }
        
        if (!mid.empty() && !s.empty() && *prev(mid.end()) < s.rbegin()->first) {
            auto it1 = prev(mid.end());
            auto it2 = prev(s.end());
            long long val1 = it1->first, val2 = it2->first;
            mid.erase(it1); mid.insert({val2, q.size()});
            s.erase(it2); s.insert({val1, q.size()});
            middleSum += val2 - val1;
        }
        
        // Remove old element
        if (q.size() > m) {
            int old = q.front(); q.pop();
            // Find and remove from appropriate set
        }
    }
    
    int calculateMKAverage() {
        if (q.size() < m) return -1;
        return middleSum / (m - 2*k);
    }
};
```

Note: C++ pbds implementation is simplified. Full implementation would need careful set management.

<!-- slide -->
```java
// Java Implementation using three TreeMaps
class MKAverage {
    int m, k;
    long middleSum = 0;
    Queue<Integer> stream;
    TreeMap<Integer, Integer> small, middle, large;
    
    public MKAverage(int m, int k) {
        this.m = m;
        this.k = k;
        stream = new LinkedList<>();
        small = new TreeMap<>();
        middle = new TreeMap<>();
        large = new TreeMap<>();
    }
    
    public void addElement(int num) {
        stream.offer(num);
        
        // Add to middle first, then rebalance
        middle.put(num, middle.getOrDefault(num, 0) + 1);
        middleSum += num;
        
        // Rebalance
        rebalance();
        
        // Remove oldest if needed
        if (stream.size() > m) {
            int old = stream.poll();
            removeFromSet(old);
            rebalance();
        }
    }
    
    private void rebalance() {
        // Move from middle to small if small has less than k
        while (small.size() < k && !middle.isEmpty()) {
            int key = middle.firstKey();
            removeOne(middle);
            small.put(key, small.getOrDefault(key, 0) + 1);
        }
        
        // Move from middle to large if large has less than k
        while (large.size() < k && !middle.isEmpty()) {
            int key = middle.lastKey();
            removeOne(middle);
            large.put(key, large.getOrDefault(key, 0) + 1);
        }
        
        // Move from small to middle if small has more than k
        while (small.size() > k) {
            int key = small.lastKey();
            removeOne(small);
            middle.put(key, middle.getOrDefault(key, 0) + 1);
            middleSum += key;
        }
        
        // Move from large to middle if large has more than k
        while (large.size() > k) {
            int key = large.firstKey();
            removeOne(large);
            middle.put(key, middle.getOrDefault(key, 0) + 1);
            middleSum += key;
        }
    }
    
    private void removeOne(TreeMap<Integer, Integer> map) {
        int key = map.firstKey();
        int count = map.get(key);
        if (count == 1) map.remove(key);
        else map.put(key, count - 1);
    }
    
    private void removeFromSet(int num) {
        if (small.containsKey(num)) {
            removeOne(small);
        } else if (large.containsKey(num)) {
            removeOne(large);
        } else {
            removeOne(middle);
            middleSum -= num;
        }
    }
    
    public int calculateMKAverage() {
        if (stream.size() < m) return -1;
        return (int)(middleSum / (m - 2 * k));
    }
}
```

Note: Java implementation is simplified. Full implementation needs careful count management.

<!-- slide -->
```javascript
// JavaScript Implementation
var MKAverage = function(m, k) {
    this.m = m;
    this.k = k;
    this.stream = [];
    this.queue = [];
    this.small = new Map();
    this.middle = new Map();
    this.large = new Map();
    this.smallSum = 0;
    this.middleSum = 0;
    this.largeSum = 0;
};

MKAverage.prototype.addElement = function(num) {
    this.queue.push(num);
    this.stream.push(num);
    
    // Add to appropriate set
    if (this.small.size === 0 || num <= [...this.small.keys()][this.small.size - 1]) {
        this.small.set(num, (this.small.get(num) || 0) + 1);
        this.smallSum += num;
    } else if (this.large.size === 0 || num >= [...this.large.keys()][0]) {
        this.large.set(num, (this.large.get(num) || 0) + 1);
        this.largeSum += num;
    } else {
        this.middle.set(num, (this.middle.get(num) || 0) + 1);
        this.middleSum += num;
    }
    
    // Rebalance would go here
    
    // Remove oldest
    if (this.queue.length > this.m) {
        // Remove from sets
    }
};

MKAverage.prototype.calculateMKAverage = function() {
    if (this.stream.length < this.m) return -1;
    return Math.floor(this.middleSum / (this.m - 2 * this.k));
};
```

Note: JavaScript implementation is simplified. Full implementation needs sorted containers.
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log m) per addElement - Tree operations |
| **Time** | O(1) per calculateMKAverage |
| **Space** | O(m) - Storing m elements |

---

## Approach 2: Brute Force (For Understanding)

### Algorithm Steps

1. Maintain a list of all elements in the stream
2. On each addElement call, simply append to the list
3. On calculateMKAverage:
   - If less than m elements, return -1
   - Take the last m elements
   - Sort the window
   - Skip first k and last k elements
   - Calculate average of remaining

### Why It Works

This approach directly follows the problem definition. While not optimal for large inputs, it clearly demonstrates the algorithm and is useful for testing and verification.

### Code Implementation

````carousel
```python
from typing import List

class MKAverage:
    def __init__(self, m: int, k: int):
        """
        Initialize MKAverage object using brute force.
        
        Args:
            m: Window size
            k: Number of elements to remove from each end
        """
        self.m = m
        self.k = k
        self.stream = []
    
    def addElement(self, num: int) -> None:
        """Insert a new element into the stream."""
        self.stream.append(num)
    
    def calculateMKAverage(self) -> int:
        """Calculate and return the MKAverage using brute force."""
        if len(self.stream) < self.m:
            return -1
        
        # Get last m elements
        window = self.stream[-self.m:]
        
        # Sort and remove k smallest and k largest
        sorted_window = sorted(window)
        middle = sorted_window[self.k:self.m - self.k]
        
        # Calculate average
        return sum(middle) // len(middle)
```

<!-- slide -->
```cpp
class MKAverage {
private:
    int m, k;
    vector<int> stream;
    
public:
    MKAverage(int m, int k) {
        this->m = m;
        this->k = k;
    }
    
    void addElement(int num) {
        stream.push_back(num);
    }
    
    int calculateMKAverage() {
        if (stream.size() < m) return -1;
        
        // Get last m elements
        vector<int> window(stream.end() - m, stream.end());
        
        // Sort and remove k smallest and largest
        sort(window.begin(), window.end());
        
        long long sum = 0;
        for (int i = k; i < m - k; i++) {
            sum += window[i];
        }
        
        return sum / (m - 2 * k);
    }
};
```

<!-- slide -->
```java
class MKAverage {
    private int m, k;
    private List<Integer> stream;
    
    public MKAverage(int m, int k) {
        this.m = m;
        this.k = k;
        this.stream = new ArrayList<>();
    }
    
    public void addElement(int num) {
        stream.add(num);
    }
    
    public int calculateMKAverage() {
        if (stream.size() < m) return -1;
        
        // Get last m elements
        List<Integer> window = stream.subList(stream.size() - m, stream.size());
        
        // Sort and remove k smallest and largest
        List<Integer> sorted = new ArrayList<>(window);
        Collections.sort(sorted);
        
        long sum = 0;
        for (int i = k; i < m - k; i++) {
            sum += sorted.get(i);
        }
        
        return (int)(sum / (m - 2 * k));
    }
}
```

<!-- slide -->
```javascript
var MKAverage = function(m, k) {
    this.m = m;
    this.k = k;
    this.stream = [];
};

MKAverage.prototype.addElement = function(num) {
    this.stream.push(num);
};

MKAverage.prototype.calculateMKAverage = function() {
    if (this.stream.length < this.m) return -1;
    
    // Get last m elements
    const window = this.stream.slice(-this.m);
    
    // Sort and remove k smallest and largest
    window.sort((a, b) => a - b);
    
    const middle = window.slice(this.k, this.m - this.k);
    
    // Calculate average
    const sum = middle.reduce((a, b) => a + b, 0);
    return Math.floor(sum / middle.length);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m log m) per calculateMKAverage - Sorting |
| **Time** | O(1) per addElement |
| **Space** | O(m) - Storing m elements |

---

## Comparison of Approaches

| Aspect | Three Heaps/TreeSets | Brute Force |
|--------|---------------------|-------------|
| **addElement** | O(log m) | O(1) |
| **calculateMKAverage** | O(1) | O(m log m) |
| **Overall** | O((n+m) log m) | O(n + m log m) |
| **Space** | O(m) | O(m) |

The optimal approach is better for frequent calculateMKAverage calls.

---

## Related Problems

Based on similar themes (data structure design, order statistics):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Sliding Window Median | [Link](https://leetcode.com/problems/sliding-window-median/) | Similar sliding window problem |
| Data Stream Median | [Link](https://leetcode.com/problems/find-median-from-data-stream/) | Online median calculation |
| Kth Largest in Array | [Link](https://leetcode.com/problems/kth-largest-element-in-an-array/) | Order statistics |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Data Structure Design

- [NeetCode - Finding MK Average](https://www.youtube.com/watch?v=hJRqXbV9GK4) - Clear explanation
- [Design Data Structures](https://www.youtube.com/watch?v=0I6o4aW-l3I) - Common patterns
- [Order Statistics Tree](https://www.youtube.com/watch?v=lex-5Z7Mas) - Understanding BST variants

---

## Follow-up Questions

### Q1: Why use three data structures?

**Answer:** We need to efficiently track k smallest, k largest, and middle elements. Three structures allow O(log m) insertion/deletion and O(1) average calculation.

---

### Q2: Can we use heaps instead of balanced BSTs?

**Answer:** Yes, heaps can work with lazy deletion. Python's heapq is a min-heap, so we'd use negation for max-heap behavior.

---

### Q3: What is the key invariant we must maintain?

**Answer:**
- small set: exactly k elements (or up to k if not enough total)
- large set: exactly k elements
- middle set: m - 2k elements
- All elements in small ≤ all in middle ≤ all in large

---

### Q4: How do we handle duplicate elements?

**Answer:** Use a count map within each set or store (value, unique_id) pairs to distinguish duplicates.

---

### Q5: What happens when the stream has exactly m elements?

**Answer:** At that point, we start calculating MKAverage. The queue stores all elements, and we have exactly k in small, m-2k in middle, and k in large.

---

### Q6: How would you implement in languages without TreeMap?

**Answer:** Use heaps with lazy deletion (mark elements as invalid) or implement your own balanced BST.

---

### Q7: What edge cases should be tested?

**Answer:**
- Adding elements before m elements are in stream
- All elements are the same
- Elements in increasing/decreasing order
- Calculate called multiple times in a row

---

## Common Pitfalls

### 1. Not Handling Duplicates
**Issue:** Losing track of duplicate values.

**Solution:** Use (value, count) pairs or unique IDs.

### 2. Not Rebalancing After Removal
**Issue:** Sets get unbalanced after removing oldest element.

**Solution:** Always call rebalance after removal.

### 3. Wrong Sum Tracking
**Issue:** Incorrect sum values leading to wrong average.

**Solution:** Carefully update sums when moving elements between sets.

---

## Summary

The **Finding MK Average** problem demonstrates:

- **Data Structure Design**: Building complex structures from simpler ones
- **Order Statistics**: Maintaining k smallest/largest efficiently
- **Sliding Window**: Maintaining fixed-size window
- **Time Complexity**: O(log m) per operation
- **Space Complexity**: O(m)

This is an advanced data structure problem that requires careful maintenance of multiple ordered sets.

For more details on this pattern, see the **[Data Structure Design](/data-structures/design)**.
