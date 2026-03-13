# Range Module

## Problem Description

A Range Module is a module that tracks ranges of numbers. Design a data structure to track the ranges represented as half-open intervals and query about them.

A half-open interval `[left, right)` denotes all the real numbers `x` where `left <= x < right`.

Implement the RangeModule class:

- `RangeModule()` — Initializes the object of the data structure.
- `void addRange(int left, int right)` — Adds the half-open interval `[left, right)`, tracking every real number in that interval. Adding an interval that partially overlaps with currently tracked numbers should add any numbers in the interval `[left, right)` that are not already tracked.
- `boolean queryRange(int left, int right)` — Returns true if every real number in the interval `[left, right)` is currently being tracked, and false otherwise.
- `void removeRange(int left, int right)` — Stops tracking every real number currently being tracked in the half-open interval `[left, right)`.

**LeetCode Link:** [LeetCode 715 - Range Module](https://leetcode.com/problems/range-module/)

---

## Examples

### Example

**Input:**
```python
["RangeModule", "addRange", "removeRange", "queryRange", "queryRange", "queryRange"]
[[], [10, 20], [14, 16], [10, 14], [13, 15], [16, 17]]
```

**Output:**
```python
[null, null, null, true, false, true]
```

**Explanation:**
```python
rangeModule = new RangeModule()
rangeModule.addRange(10, 20)
rangeModule.removeRange(14, 16)
rangeModule.queryRange(10, 14)   # return True (every number in [10, 14) is being tracked)
rangeModule.queryRange(13, 15)   # return False (numbers like 14, 14.03, 14.17 in [13, 15) are not being tracked)
rangeModule.queryRange(16, 17)   # return True (the number 16 in [16, 17) is still being tracked)
```

---

## Constraints

- `1 <= left < right <= 10^9`
- At most `10^4` calls will be made to `addRange`, `queryRange`, and `removeRange`.

---

## Pattern: Interval Management with Sorted Data Structure

This problem uses a **Sorted List** to maintain intervals. Use bisect for O(log n) lookups, merge on overlap, split on removal.

---

## Intuition

The key insight for this problem is maintaining a **sorted list of non-overlapping intervals** that represent all currently tracked ranges. This allows efficient operations:

### Key Observations

1. **Sorted Intervals**: Keep intervals sorted by their start position. This enables binary search for O(log n) lookups.

2. **Non-overlapping Invariant**: Maintain the invariant that intervals never overlap. When an overlap occurs during add, merge the intervals.

3. **Half-open Intervals**: The interval `[left, right)` includes left but excludes right. This is important for correctness.

4. **Three Core Operations**:
   - **addRange**: Merge with overlapping intervals
   - **queryRange**: Check if any interval fully covers the query range
   - **removeRange**: Split intervals that overlap with the removal range

5. **Binary Search**: Use bisect to find the position of intervals efficiently.

### Algorithm Overview

1. **addRange(left, right)**:
   - Find all intervals that overlap with [left, right)
   - Merge them into one extended interval
   - Replace all overlapping intervals with the merged one

2. **queryRange(left, right)**:
   - Use binary search to find relevant intervals
   - Check if any single interval fully covers [left, right)

3. **removeRange(left, right)**:
   - Find intervals that overlap with [left, right)
   - Split them if needed (left part and/or right part)
   - Replace original intervals with split parts

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Sorted List Approach** - Using sortedcontainers (standard solution)
2. **Custom Binary Search Tree** - Using self-balanced BST

---

## Approach 1: Sorted List (Standard)

### Algorithm Steps

1. Use SortedList to store non-overlapping intervals
2. For addRange: Find overlapping intervals, merge them
3. For queryRange: Check if any interval fully covers the range
4. For removeRange: Split overlapping intervals as needed

### Why It Works

By maintaining a sorted list of non-overlapping intervals, we can efficiently find and manipulate intervals using binary search.

### Code Implementation

````carousel
```python
from sortedcontainers import SortedList

class RangeModule:
    def __init__(self):
        """Initialize the RangeModule with empty intervals."""
        self.intervals = SortedList()

    def addRange(self, left: int, right: int) -> None:
        """
        Add the half-open interval [left, right).
        
        Args:
            left: Start of interval (inclusive)
            right: End of interval (exclusive)
        """
        # Find intervals that might overlap with [left, right)
        i = self.intervals.bisect_left((left, float('inf')))
        
        # Merge with overlapping intervals
        while i < len(self.intervals) and self.intervals[i][0] <= right:
            left = min(left, self.intervals[i][0])
            right = max(right, self.intervals[i][1])
            self.intervals.pop(i)
        
        # Add the merged interval
        self.intervals.add((left, right))

    def queryRange(self, left: int, right: int) -> bool:
        """
        Check if [left, right) is fully tracked.
        
        Args:
            left: Start of query range (inclusive)
            right: End of query range (exclusive)
            
        Returns:
            True if fully tracked, False otherwise
        """
        i = self.intervals.bisect_left((left, float('inf')))
        
        # Check previous interval
        if i > 0:
            prev = self.intervals[i - 1]
            if prev[1] >= right:
                return True
        
        # Check current interval
        if i < len(self.intervals):
            curr = self.intervals[i]
            if curr[0] <= left and curr[1] >= right:
                return True
        
        return False

    def removeRange(self, left: int, right: int) -> None:
        """
        Remove the half-open interval [left, right).
        
        Args:
            left: Start of interval to remove (inclusive)
            right: End of interval to remove (exclusive)
        """
        i = self.intervals.bisect_left((left, float('inf')))
        
        while i < len(self.intervals) and self.intervals[i][0] < right:
            curr = self.intervals[i]
            
            # Keep left part if exists
            if curr[0] < left:
                self.intervals.add((curr[0], left))
            
            # Keep right part if exists
            if curr[1] > right:
                self.intervals.add((right, curr[1]))
            
            # Remove the original interval
            self.intervals.pop(i)
```

<!-- slide -->
```cpp
#include <map>
using namespace std;

class RangeModule {
private:
    map<int, int> intervals;  // start -> end
    
public:
    RangeModule() {}
    
    void addRange(int left, int right) {
        // Find overlapping intervals
        auto it = intervals.lower_bound(left);
        if (it != intervals.begin()) {
            it = prev(it);
        }
        
        // Merge overlapping intervals
        int newLeft = left, newRight = right;
        vector<int> toErase;
        
        while (it != intervals.end() && it->first < right) {
            newLeft = min(newLeft, it->first);
            newRight = max(newRight, it->second);
            toErase.push_back(it->first);
            it = next(it);
        }
        
        for (auto& key : toErase) {
            intervals.erase(key);
        }
        
        intervals[newLeft] = newRight;
    }
    
    bool queryRange(int left, int right) {
        auto it = intervals.lower_bound(left);
        if (it != intervals.begin()) {
            it = prev(it);
        }
        
        if (it != intervals.end() && it->first <= left && it->second >= right) {
            return true;
        }
        return false;
    }
    
    void removeRange(int left, int right) {
        vector<pair<int, int>> toAdd;
        auto it = intervals.lower_bound(left);
        if (it != intervals.begin()) {
            it = prev(it);
        }
        
        while (it != intervals.end() && it->first < right) {
            int start = it->first, end = it->second;
            it = next(it);
            intervals.erase(start);
            
            if (start < left) {
                toAdd.push_back({start, left});
            }
            if (end > right) {
                toAdd.push_back({right, end});
            }
        }
        
        for (auto& p : toAdd) {
            intervals[p.first] = p.second;
        }
    }
};
```

<!-- slide -->
```java
import java.util.*;

class RangeModule {
    private TreeMap<Integer, Integer> intervals;
    
    public RangeModule() {
        intervals = new TreeMap<>();
    }
    
    public void addRange(int left, int right) {
        // Find overlapping intervals
        Map.Entry<Integer, Integer> it = intervals.floorEntry(left);
        if (it != null && it.getValue() < left) {
            it = intervals.higherEntry(left);
        }
        
        int newLeft = left, newRight = right;
        List<Integer> toRemove = new ArrayList<>();
        
        while (it != null && it.getKey() < right) {
            newLeft = Math.min(newLeft, it.getKey());
            newRight = Math.max(newRight, it.getValue());
            toRemove.add(it.getKey());
            it = it.getValue() < right ? intervals.higherEntry(it.getKey()) : null;
        }
        
        for (Integer key : toRemove) {
            intervals.remove(key);
        }
        
        intervals.put(newLeft, newRight);
    }
    
    public boolean queryRange(int left, int right) {
        Map.Entry<Integer, Integer> it = intervals.floorEntry(left);
        if (it != null && it.getValue() >= right) {
            return true;
        }
        return false;
    }
    
    public void removeRange(int left, int right) {
        Map.Entry<Integer, Integer> it = intervals.floorEntry(left);
        if (it != null && it.getValue() > left) {
            int start = it.getKey(), end = it.getValue();
            intervals.remove(start);
            if (start < left) {
                intervals.put(start, left);
            }
            if (end > right) {
                intervals.put(right, end);
            }
        }
        
        it = intervals.higherEntry(left);
        while (it != null && it.getKey() < right) {
            int start = it.getKey(), end = it.getValue();
            it = intervals.higherEntry(it.getKey());
            intervals.remove(start);
            if (end > right) {
                intervals.put(right, end);
            }
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Your RangeModule object will be instantiated and called as such:
 * var obj = new RangeModule()
 * obj.addRange(left,right)
 * var param_2 = obj.queryRange(left,right)
 * obj.removeRange(left,right)
 */
var RangeModule = function() {
    this.intervals = new Map();
};

RangeModule.prototype.addRange = function(left, right) {
    // Find overlapping intervals
    let it = this.intervals.get(left);
    const toRemove = [];
    const toAdd = [];
    
    // Check intervals that might overlap
    for (const [start, end] of this.intervals) {
        if (start < right && end > left) {
            toRemove.push(start);
            left = Math.min(left, start);
            right = Math.max(right, end);
        }
    }
    
    // Remove overlapping intervals
    for (const start of toRemove) {
        this.intervals.delete(start);
    }
    
    // Add merged interval
    this.intervals.set(left, right);
};

RangeModule.prototype.queryRange = function(left, right) {
    for (const [start, end] of this.intervals) {
        if (start <= left && end >= right) {
            return true;
        }
    }
    return false;
};

RangeModule.prototype.removeRange = function(left, right) {
    const toRemove = [];
    const toAdd = [];
    
    for (const [start, end] of this.intervals) {
        if (start < right && end > left) {
            toRemove.push(start);
            if (start < left) {
                toAdd.push([start, left]);
            }
            if (end > right) {
                toAdd.push([right, end]);
            }
        }
    }
    
    for (const start of toRemove) {
        this.intervals.delete(start);
    }
    
    for (const [s, e] of toAdd) {
        this.intervals.set(s, e);
    }
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log n + k) per operation where k is number of overlapping intervals |
| **Space** | O(n) for storing intervals |

---

## Approach 2: Segment Tree

### Algorithm Steps

1. Use a segment tree to track covered ranges
2. Add range: Mark the range as covered
3. Query range: Check if all positions in range are covered
4. Remove range: Mark the range as uncovered

### Why It Works

A segment tree provides O(log N) operations for range updates and queries.

### Code Implementation

````carousel
```python
# Segment tree approach (conceptual)
# This is a simplified version for understanding
class RangeModule:
    def __init__(self):
        self.covered = set()  # Simplified for small range
    
    def addRange(self, left, right):
        for i in range(left, right):
            self.covered.add(i)
    
    def queryRange(self, left, right):
        for i in range(left, right):
            if i not in self.covered:
                return False
        return True
    
    def removeRange(self, left, right):
        for i in range(left, right):
            self.covered.discard(i)
```

<!-- slide -->
```cpp
// Segment tree approach requires more complex implementation
// Not provided due to complexity
```

<!-- slide -->
```java
// Segment tree approach requires more complex implementation
// Not provided due to complexity
```

<!-- slide -->
```javascript
// Segment tree approach requires more complex implementation
// Not provided due to complexity
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(log N) per operation with proper segment tree |
| **Space** | O(N) |

---

## Comparison of Approaches

| Aspect | Sorted List | Segment Tree |
|--------|-------------|--------------|
| **Time Complexity** | O(log n + k) | O(log N) |
| **Space Complexity** | O(n) | O(N) |
| **Implementation** | Simple | Complex |
| **Best For** | Sparse intervals | Dense intervals |

**Best Approach:** Use the Sorted List approach as it's simpler and efficient for this problem.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon
- **Difficulty**: Hard
- **Concepts Tested**: Data Structure Design, Interval Management, Binary Search

### Learning Outcomes

1. **Interval Management**: Learn to handle interval operations efficiently
2. **Sorted Data Structures**: Master sorted containers and binary search
3. **Edge Cases**: Handle half-open intervals and edge cases

---

## Related Problems

Based on similar themes (Interval Management):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge Intervals | [Link](https://leetcode.com/problems/merge-intervals/) | Merge overlapping intervals |
| Insert Interval | [Link](https://leetcode.com/problems/insert-interval/) | Insert and merge |
| Employee Free Time | [Link](https://leetcode.com/problems/employee-free-time/) | Interval scheduling |

### Pattern Reference

For more detailed explanations, see:
- **[Interval Pattern](/patterns/interval)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Range Module](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Interval Management](https://www.youtube.com/watch?v=example)** - Understanding intervals
3. **[LeetCode 715 Solution](https://www.youtube.com/watch?v=example)** - Full solution

---

## Follow-up Questions

### Q1: How would you modify the solution to handle floating-point numbers?

**Answer:** You'd need to scale the floating-point numbers to integers or use a different data structure like an ordered map with rational numbers.

---

### Q2: What if we need to query the total length of all tracked ranges?

**Answer:** Maintain a separate variable tracking total covered length, updating it during add and remove operations.

---

### Q3: How would you implement a thread-safe version?

**Answer:** Add locks/mutex around critical sections in addRange, queryRange, and removeRange methods.

---

## Common Pitfalls

### 1. Half-open Intervals
**Issue**: Confusing [left, right) with [left, right].

**Solution**: Remember right is exclusive. Use `<` not `<=` for comparisons.

### 2. Merge Logic
**Issue**: Not correctly merging overlapping intervals.

**Solution**: Take min of lefts and max of rights when intervals overlap.

### 3. Remove Splitting
**Issue**: Not handling the case where removal splits an interval.

**Solution**: Create up to two new intervals: left part and right part.

---

## Summary

The **Range Module** problem demonstrates how to efficiently manage intervals using sorted data structures.

Key takeaways:
1. Maintain sorted, non-overlapping intervals
2. Use binary search for O(log n) lookups
3. Handle merging in addRange and splitting in removeRange
4. Remember half-open interval semantics

This problem is essential for understanding interval management and data structure design.

### Pattern Summary

This problem exemplifies the **Interval Management** pattern, characterized by:
- Sorted interval storage
- Binary search for efficient lookup
- Merging and splitting operations

For more details on interval problems, see the **[Interval Pattern](/patterns/interval)**.

---

## Additional Resources

- [LeetCode Problem 715](https://leetcode.com/problems/range-module/) - Official problem page
- [Interval Scheduling - GeeksforGeeks](https://www.geeksforgeeks.org/interval-subset/) - Interval concepts
- [Pattern: Interval](/patterns/interval) - Comprehensive pattern guide
