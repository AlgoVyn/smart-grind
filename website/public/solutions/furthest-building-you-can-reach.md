# Furthest Building You Can Reach

## Problem Description

You are given an integer array heights representing the heights of buildings, some bricks, and some ladders.
You start your journey from building 0 and move to the next building by possibly using bricks or ladders.
While moving from building i to building i+1 (0-indexed),
- If the current building's height is greater than or equal to the next building's height, you do not need a ladder or bricks.
- If the current building's height is less than the next building's height, you can either use one ladder or (h[i+1] - h[i]) bricks.
Return the furthest building index (0-indexed) you can reach if you use the given ladders and bricks optimally.

**LeetCode Link:** [Furthest Building You Can Reach - LeetCode 1642](https://leetcode.com/problems/furthest-building-you-can-reach/)

---

## Examples

### Example 1:

**Input:** heights = [4,2,7,6,9,14,12], bricks = 5, ladders = 1

**Output:** 4

**Explanation:** Starting at building 0, you can follow these steps:
- Go to building 1 without using ladders nor bricks since 4 >= 2.
- Go to building 2 using 5 bricks. You must use either bricks or ladders because 2 < 7.
- Go to building 3 without using ladders nor bricks since 7 >= 6.
- Go to building 4 using your only ladder. You must use either bricks or ladders because 6 < 9.
It is impossible to go beyond building 4 because you do not have any more bricks or ladders.

### Example 2:

**Input:** heights = [4,12,2,7,3,18,20,3,19], bricks = 10, ladders = 2

**Output:** 7

### Example 3:

**Input:** heights = [14,3,19,3], bricks = 17, ladders = 0

**Output:** 3

---

## Constraints

- 1 <= heights.length <= 10^5
- 1 <= heights[i] <= 10^6
- 0 <= bricks <= 10^9
- 0 <= ladders <= heights.length

---

## Pattern: Greedy with Min-Heap (Resource Allocation)

This problem uses the **Greedy + Heap** pattern where ladders are used for the largest height differences. A min-heap tracks all height differences where we've used resources; when the heap exceeds ladder count, we use bricks for the smallest difference.

### Core Concept

- **Ladders are Limited**: Use them for biggest gaps (most expensive in bricks)
- **Min-Heap Tracks Gaps**: Keep all height differences in heap, use bricks for smallest when needed
- **Greedy Works**: Always using ladders for largest gaps is optimal
- **Fallback to Bricks**: When heap exceeds ladder count, pop smallest and use bricks

### When to Use This Pattern

This pattern is applicable when:
1. Resource allocation with limited resources
2. Maximizing reach with given constraints
3. Greedy selection with priority queue

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Priority Queue | For resource management |
| Greedy Algorithm | For optimal allocation |
| Heap Sort | For largest/smallest tracking |

### Pattern Summary

This problem exemplifies **Greedy Resource Allocation**, characterized by:
- Using heap to track all resource usages
- Ladders for largest gaps
- Bricks as fallback

---

## Intuition

The key insight is using **greedy allocation** of ladders vs bricks. Ladders should be used for the largest height differences because bricks can be used for any gap.

### Key Observations

1. **Ladders are Limited**: Use them for biggest gaps (most expensive in bricks)
2. **Min-Heap Tracks Gaps**: Keep all height differences in heap, use bricks for smallest when needed
3. **Greedy Works**: Always using ladders for largest gaps is optimal
4. **Fallback to Bricks**: When heap exceeds ladder count, pop smallest and use bricks

### Why Greedy Works

Ladders can only be used once and are more flexible than bricks (bricks can be used for any gap). Therefore, we should reserve ladders for the biggest gaps where we'd otherwise need the most bricks.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Min-Heap (Greedy)** - Use heap to track gaps
2. **Binary Search** - Alternative approach

---

## Approach 1: Min-Heap (Greedy) - Optimal

### Algorithm Steps

1. Initialize an empty min-heap
2. Iterate through each building (except the last)
3. For each positive height difference:
   - Push it onto the heap
   - If heap size exceeds ladder count:
     - Pop smallest difference (use bricks instead)
     - Subtract from bricks
     - If bricks become negative, return current index
4. If we complete the loop, return the last index

### Why It Works

The greedy approach works because ladders are more valuable than bricks. By always using ladders for the largest gaps, we minimize brick usage, maximizing our reach.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def furthestBuilding(self, heights: List[int], bricks: int, ladders: int) -> int:
        """
        Find furthest building using greedy + heap.
        
        Args:
            heights: Array of building heights
            bricks: Total bricks available
            ladders: Total ladders available
            
        Returns:
            Furthest building index reachable
        """
        heap = []
        
        for i in range(len(heights) - 1):
            diff = heights[i + 1] - heights[i]
            
            # Only consider positive differences (going up)
            if diff > 0:
                heapq.heappush(heap, diff)
                
                # If using more resources than ladders available
                if len(heap) > ladders:
                    # Use bricks for the smallest gap
                    bricks -= heapq.heappop(heap)
                    
                    # Can't proceed further
                    if bricks < 0:
                        return i
        
        return len(heights) - 1
```

<!-- slide -->
```cpp
#include <vector>
#include <priority_queue>
using namespace std;

class Solution {
public:
    int furthestBuilding(vector<int>& heights, int bricks, int ladders) {
        priority_queue<int, vector<int>, greater<int>> heap;
        
        for (int i = 0; i < heights.size() - 1; i++) {
            int diff = heights[i + 1] - heights[i];
            
            if (diff > 0) {
                heap.push(diff);
                
                if (heap.size() > ladders) {
                    bricks -= heap.top();
                    heap.pop();
                    
                    if (bricks < 0) {
                        return i;
                    }
                }
            }
        }
        
        return heights.size() - 1;
    }
};
```

<!-- slide -->
```java
import java.util.PriorityQueue;

class Solution {
    public int furthestBuilding(int[] heights, int bricks, int ladders) {
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        
        for (int i = 0; i < heights.length - 1; i++) {
            int diff = heights[i + 1] - heights[i];
            
            if (diff > 0) {
                heap.add(diff);
                
                if (heap.size() > ladders) {
                    bricks -= heap.poll();
                    
                    if (bricks < 0) {
                        return i;
                    }
                }
            }
        }
        
        return heights.length - 1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} heights
 * @param {number} bricks
 * @param {number} ladders
 * @return {number}
 */
var furthestBuilding = function(heights, bricks, ladders) {
    const heap = [];
    
    for (let i = 0; i < heights.length - 1; i++) {
        const diff = heights[i + 1] - heights[i];
        
        if (diff > 0) {
            heap.push(diff);
            heap.sort((a, b) => a - b);  // Min-heap simulation
            
            if (heap.length > ladders) {
                bricks -= heap.shift();  // Use bricks for smallest
                
                if (bricks < 0) {
                    return i;
                }
            }
        }
    }
    
    return heights.length - 1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) for heap operations |
| **Space** | O(n) worst case for heap |

---

## Approach 2: Binary Search

### Algorithm Steps

1. Use binary search to find the maximum reachable building
2. For each mid, check if we can reach it with given bricks and ladders
3. For feasibility: simulate using as many ladders as possible for largest gaps

### Why It Works

Binary search finds the maximum index by testing feasibility at each step. We can verify if a position is reachable using the greedy approach limited to that position.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def furthestBuilding(self, heights: List[int], bricks: int, ladders: int) -> int:
        """Binary search approach."""
        
        def can_reach(idx: int) -> bool:
            """Check if we can reach building idx."""
            # Get all height differences up to idx
            diffs = []
            for i in range(idx):
                d = heights[i + 1] - heights[i]
                if d > 0:
                    diffs.append(d)
            
            # Use ladders for largest differences
            diffs.sort(reverse=True)
            
            # Use ladders first, then bricks
            for i in range(min(ladders, len(diffs))):
                diffs[i] = 0
            
            # Check if remaining sum fits in bricks
            return sum(diffs) <= bricks
        
        # Binary search
        left, right = 0, len(heights) - 1
        while left < right:
            mid = (left + right + 1) // 2
            if can_reach(mid):
                left = mid
            else:
                right = mid - 1
        
        return left
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int furthestBuilding(vector<int>& heights, int bricks, int ladders) {
        auto canReach = [&](int idx) {
            vector<int> diffs;
            for (int i = 0; i < idx; i++) {
                int d = heights[i + 1] - heights[i];
                if (d > 0) diffs.push_back(d);
            }
            
            sort(diffs.rbegin(), diffs.rend());
            for (int i = 0; i < min(ladders, (int)diffs.size()); i++) {
                diffs[i] = 0;
            }
            
            long long sum = 0;
            for (int d : diffs) sum += d;
            return sum <= bricks;
        };
        
        int left = 0, right = heights.size() - 1;
        while (left < right) {
            int mid = (left + right + 1) / 2;
            if (canReach(mid)) left = mid;
            else right = mid - 1;
        }
        
        return left;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int furthestBuilding(int[] heights, int bricks, int ladders) {
        
        java.util.function.Predicate<Integer> canReach = idx -> {
            java.util.List<Integer> diffs = new java.util.ArrayList<>();
            for (int i = 0; i < idx; i++) {
                int d = heights[i + 1] - heights[i];
                if (d > 0) diffs.add(d);
            }
            
            diffs.sort((a, b) -> b - a);
            for (int i = 0; i < Math.min(ladders, diffs.size()); i++) {
                diffs.set(i, 0);
            }
            
            long sum = diffs.stream().mapToLong(Integer::longValue).sum();
            return sum <= bricks;
        };
        
        int left = 0, right = heights.length - 1;
        while (left < right) {
            int mid = (left + right + 1) / 2;
            if (canReach.test(mid)) left = mid;
            else right = mid - 1;
        }
        
        return left;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} heights
 * @param {number} bricks
 * @param {number} ladders
 * @return {number}
 */
var furthestBuilding = function(heights, bricks, ladders) {
    const canReach = (idx) => {
        const diffs = [];
        for (let i = 0; i < idx; i++) {
            const d = heights[i + 1] - heights[i];
            if (d > 0) diffs.push(d);
        }
        
        diffs.sort((a, b) => b - a);
        for (let i = 0; i < Math.min(ladders, diffs.length); i++) {
            diffs[i] = 0;
        }
        
        const sum = diffs.reduce((a, b) => a + b, 0);
        return sum <= bricks;
    };
    
    let left = 0, right = heights.length - 1;
    while (left < right) {
        const mid = Math.floor((left + right + 1) / 2);
        if (canReach(mid)) left = mid;
        else right = mid - 1;
    }
    
    return left;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) for feasibility checks |
| **Space** | O(n) for diffs array |

---

## Comparison of Approaches

| Aspect | Min-Heap | Binary Search |
|--------|----------|---------------|
| **Time Complexity** | O(n log n) | O(n log n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simpler | More complex |
| **Recommended** | ✅ | Alternative |

**Best Approach:** Use Approach 1 (Min-Heap) for simplicity and efficiency.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Greedy Algorithms, Heap, Resource Allocation

### Learning Outcomes

1. **Greedy Mastery**: Learn when greedy selection is optimal
2. **Heap Application**: Master heap for resource tracking
3. **Trade-off Analysis**: Understand when to use limited vs unlimited resources

---

## Related Problems

Based on similar themes (Greedy + Heap):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Number of Refueling Stops | [Link](https://leetcode.com/problems/minimum-number-of-refueling-stops/) | Greedy + max heap |
| Maximum Number of Events | [Link](https://leetcode.com/problems/maximum-number-of-events-you-can-attend/) | Greedy + heap |
| Course Schedule III | [Link](https://leetcode.com/problems/course-schedule-iii/) | Greedy + heap |

### Pattern Reference

For more detailed explanations, see:
- **[Greedy Algorithms](/patterns/greedy)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Furthest Building](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[Greedy + Heap Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Resource allocation
3. **[LeetCode 1642](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Problem walkthrough

---

## Follow-up Questions

### Q1: What if ladders could be reused?

**Answer:** This would change the problem significantly. We'd use binary search or dynamic programming.

---

### Q2: How would you track which buildings use ladders?

**Answer:** Store the index along with the difference in the heap.

---

### Q3: What's the difference between this and the "Minimum Number of Refueling Stops" problem?

**Answer:** Refueling uses max-heap (largest fuel first), while this uses min-heap (smallest bricks needed first).

---

## Common Pitfalls

### 1. Using heap incorrectly
**Issue:** The heap should contain all diffs where resources are used, not just ladder diffs.

**Solution:** Push all positive diffs to heap, then manage with ladders.

### 2. When to use bricks
**Issue:** When heap size exceeds ladders, pop smallest diff and use bricks for it.

**Solution:** Always check heap size after pushing.

### 3. Not handling negative heights
**Issue:** Only push positive differences (height increases).

**Solution:** Check diff > 0 before pushing.

### 4. Early return condition
**Issue:** Return current index when bricks become negative, not after.

**Solution:** Return i when bricks < 0.

---

## Summary

The **Furthest Building You Can Reach** problem demonstrates **Greedy + Heap** pattern:

- **Approach**: Use min-heap to track height differences, use bricks for smallest when ladder count exceeded
- **Greedy**: Ladders always for largest gaps
- **Time**: O(n log n) for heap operations
- **Space**: O(n) worst case for heap

Key insight: Maximize ladder usage for biggest gaps since bricks can substitute any gap.

### Pattern Summary

This problem exemplifies **Greedy Resource Allocation**, characterized by:
- Using heap to track all resource usages
- Ladders for largest gaps
- Bricks as fallback
- Greedy selection

For more details on this pattern, see the **[Greedy Algorithms](/patterns/greedy)** pattern.

---

## Additional Resources

- [LeetCode Problem 1642](https://leetcode.com/problems/furthest-building-you-can-reach/) - Official problem page
- [Greedy Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/) - Theory
- [Heap Data Structure](https://en.wikipedia.org/wiki/Heap_(data_structure)) - Heap explanation
- [Pattern: Greedy](/patterns/greedy) - Comprehensive pattern guide
