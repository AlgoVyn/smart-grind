# Last Stone Weight

## Problem Description

You are given an array of integers `stones` where `stones[i]` is the weight of the `ith` stone.

We are playing a game with the stones. On each turn, we **choose the heaviest two stones** and smash them together. Suppose the heaviest two stones have weights `x` and `y` with `x <= y`. The result of this smash is:

- If `x == y`, **both stones are destroyed**
- If `x != y`, the stone of weight `x` is destroyed, and the stone of weight `y` has new weight `y - x`

At the end of the game, there is **at most one stone left**. Return the weight of the last remaining stone. If there are no stones left, return `0`.

**Link to problem:** [Last Stone Weight - LeetCode 1046](https://leetcode.com/problems/last-stone-weight/)

---

## Examples

**Example 1:**
```
Input: stones = [2,7,4,1,8,1]
Output: 1
```

1. Combine 7 and 8 to get 1 → `[2,4,1,1,1]`
2. Combine 2 and 4 to get 2 → `[2,1,1,1]`
3. Combine 2 and 1 to get 1 → `[1,1,1]`
4. Combine 1 and 1 to get 0 → `[1]`
5. Last stone weight = 1

---

**Example 2:**
```
Input: stones = [1]
Output: 1
```

---

## Constraints

- `1 <= stones.length <= 30`
- `1 <= stones[i] <= 1000`

---

## Pattern:

This problem follows the **Priority Queue (Heap)** pattern for repeatedly selecting maximum elements.

### Core Concept

- **Max-Heap Selection**: Always extract two heaviest stones efficiently
- **Greedy Smash**: Compare and push back difference if not equal
- **Iterative Reduction**: Reduce problem size with each operation

### When to Use This Pattern

This pattern is applicable when:
1. Repeatedly finding maximum/k largest elements
2. Problems requiring greedy selection
3. Game/play simulation with scoring

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Heap Sort | Using heap for sorting |
| Top K Elements | Finding k largest elements |
| Priority Queue | Element ordering |

---

## Common Pitfalls

### 1. Wrong Heap Type
**Issue:** Using min-heap instead of max-heap.

**Solution:** Negate values for Python min-heap, or use language's max-heap (C++ priority_queue).

### 2. Not Handling Single Element
**Issue:** Not returning correct value when only one stone remains.

**Solution:** Check heap size before popping; return top or 0.

### 3. Forgetting Negative Values
**Issue:** Forgetting to negate values when using Python heapq.

**Solution:** Negate on push and pop: -heapq.heappush(heap, -value).

---

## Intuition

The key insight is that we always need to process the two heaviest stones. This suggests using a max-heap (priority queue) data structure.

Since Python's heapq is a min-heap, we can negate the values to simulate a max-heap. The algorithm repeatedly:
1. Extract the two largest stones
2. Compare them and push back the difference if they're not equal

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Heap-based (Optimal)** - O(n log n) time
2. **Sorting** - O(n² log n) time
3. **Recursive** - O(n²) time

---

## Approach 1: Heap-based (Optimal)

This is the most efficient and commonly used approach.

### Why It Works

A max-heap always gives us the two largest elements in O(1) time, and inserting/removing takes O(log n) time. This perfectly matches our problem requirements.

### Algorithm Steps

1. Convert stones array to a max-heap (negate values)
2. While there are at least 2 stones:
   - Pop the two heaviest stones
   - If they're different, push back the difference
3. Return the remaining stone weight (or 0 if none)

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def lastStoneWeight(self, stones: List[int]) -> int:
        """
        Find the weight of the last remaining stone.
        
        Args:
            stones: List of stone weights
            
        Returns:
            Weight of the last stone or 0
        """
        # Convert to max-heap by negating values
        stones = [-s for s in stones]
        heapq.heapify(stones)
        
        # While there are at least 2 stones
        while len(stones) > 1:
            # Pop two heaviest stones
            y = -heapq.heappop(stones)
            x = -heapq.heappop(stones)
            
            # If they're different, push back the difference
            if x != y:
                heapq.heappush(stones, -(y - x))
        
        # Return remaining stone or 0
        return -stones[0] if stones else 0
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int lastStoneWeight(vector<int>& stones) {
        // Use max-heap (priority_queue in C++)
        priority_queue<int> pq;
        
        // Add all stones to heap
        for (int stone : stones) {
            pq.push(stone);
        }
        
        // While there are at least 2 stones
        while (pq.size() > 1) {
            int y = pq.top(); pq.pop();
            int x = pq.top(); pq.pop();
            
            if (x != y) {
                pq.push(y - x);
            }
        }
        
        return pq.empty() ? 0 : pq.top();
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int lastStoneWeight(int[] stones) {
        // Use max-heap via PriorityQueue
        PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
        
        // Add all stones to heap
        for (int stone : stones) {
            pq.add(stone);
        }
        
        // While there are at least 2 stones
        while (pq.size() > 1) {
            int y = pq.poll();
            int x = pq.poll();
            
            if (x != y) {
                pq.add(y - x);
            }
        }
        
        return pq.isEmpty() ? 0 : pq.poll();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} stones
 * @return {number}
 */
var lastStoneWeight = function(stones) {
    // Use max-heap via negative values
    const pq = stones.map(s => -s);
    heapq.heapify(pq);
    
    // While there are at least 2 stones
    while (pq.length > 1) {
        const y = -heapq.heappop(pq);
        const x = -heapq.heappop(pq);
        
        if (x !== y) {
            heapq.heappush(pq, -(y - x));
        }
    }
    
    return pq.length === 0 ? 0 : -pq[0];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Each heap operation is O(log n), we do at most n operations |
| **Space** | O(n) - For the heap |

---

## Approach 2: Sorting

This is a simpler but less efficient approach.

### Why It Works

Instead of a heap, we can sort the array and always pick the two largest elements. However, this requires re-sorting after each operation.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def lastStoneWeight_sort(self, stones: List[int]) -> int:
        """
        Find weight using sorting approach.
        
        Args:
            stones: List of stone weights
            
        Returns:
            Weight of the last stone or 0
        """
        stones.sort()
        
        while len(stones) > 1:
            y = stones.pop()
            x = stones.pop()
            
            if x != y:
                # Insert the difference in sorted position
                bisect.insort(stones, y - x)
        
        return stones[0] if stones else 0
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lastStoneWeight(vector<int> stones) {
        sort(stones.begin(), stones.end(), greater<int>());
        
        while (stones.size() > 1) {
            int y = stones[0];
            stones.erase(stones.begin());
            int x = stones[0];
            stones.erase(stones.begin());
            
            if (x != y) {
                // Insert in sorted position
                auto it = lower_bound(stones.begin(), stones.end(), y - x, greater<int>());
                stones.insert(it, y - x);
            }
        }
        
        return stones.empty() ? 0 : stones[0];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int lastStoneWeight(int[] stones) {
        Arrays.sort(stones);
        
        List<Integer> list = new ArrayList<>();
        for (int s : stones) list.add(s);
        
        while (list.size() > 1) {
            int last = list.size() - 1;
            int y = list.remove(last);
            int x = list.remove(last - 1);
            
            if (x != y) {
                // Find position to insert
                int pos = list.size() - 1;
                while (pos >= 0 && list.get(pos) < y - x) pos--;
                list.add(pos + 1, y - x);
            }
        }
        
        return list.isEmpty() ? 0 : list.get(0);
    }
}
```

<!-- slide -->
```javascript
var lastStoneWeight = function(stones) {
    stones.sort((a, b) => b - a);
    
    while (stones.length > 1) {
        const y = stones.shift();
        const x = stones.shift();
        
        if (x !== y) {
            // Find position to insert
            let pos = 0;
            while (pos < stones.length && stones[pos] > y - x) pos++;
            stones.splice(pos, 0, y - x);
        }
    }
    
    return stones.length === 0 ? 0 : stones[0];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² log n) - Sorting is O(n log n), done n times |
| **Space** | O(n) - For the array |

---

## Comparison of Approaches

| Aspect | Heap | Sorting |
|--------|------|---------|
| **Time Complexity** | O(n log n) | O(n² log n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Interview favorite | Understanding |

**Best Approach:** The heap-based approach (Approach 1) is optimal and most commonly used.

---

## Why Heap is Optimal

1. **Efficiency**: O(n log n) vs O(n² log n) for sorting
2. **Natural Fit**: Always gives us the two heaviest stones in O(1)
3. **Simplicity**: Easy to implement with standard libraries
4. **Interview Favorite**: Demonstrates understanding of data structures

---

## Related Problems

Based on similar themes (heap, greedy):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| K Closest Points to Origin | [Link](https://leetcode.com/problems/k-closest-points-to-origin/) | Heap-based |
| Top K Frequent Elements | [Link](https://leetcode.com/problems/top-k-frequent-elements/) | Heap-based |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Task Scheduler | [Link](https://leetcode.com/problems/task-scheduler/) | Heap with cooldown |
| Find Median from Data Stream | [Link](https://leetcode.com/problems/find-median-from-data-stream/) | Two heaps |

---

## Video Tutorial Links

### Heap-based Solution

- [NeetCode - Last Stone Weight](https://www.youtube.com/watch?v=2j8sC1M7M5M) - Clear explanation
- [Priority Queue Explanation](https://www.youtube.com/watch?v=2j8sC1M7M5M) - Understanding heaps

---

## Follow-up Questions

### Q1: What is the time and space complexity?

**Answer:** O(n log n) time and O(n) space. Each heap operation is O(log n), and we do at most n operations.

---

### Q2: Can you solve it without using a heap?

**Answer:** Yes, you can sort the array and always pick the two largest elements. However, this is less efficient at O(n² log n).

---

### Q3: What happens when all stones have the same weight?

**Answer:** If all stones have the same weight and there's an even number of them, they'll all be destroyed and the result will be 0. If odd, one stone will remain.

---

### Q4: How would you modify to get the final stones (not just weight)?

**Answer:** Instead of just tracking the difference, store the indices or original values. The problem only asks for the final weight.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single stone (return that weight)
- Two equal stones (return 0)
- All decreasing weights
- All same weights
- Maximum input size

---

## Summary

The **Last Stone Weight** problem demonstrates the power of heap data structures:

- **Heap-based**: O(n log n) - Optimal and efficient
- **Sorting**: O(n² log n) - Simpler but less efficient

The key insight is that we always need to process the two heaviest stones, which makes a max-heap the perfect data structure for this problem.

This is a classic heap problem that tests understanding of priority queues and greedy algorithms.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/last-stone-weight/)
- [Priority Queue - Wikipedia](https://en.wikipedia.org/wiki/Priority_queue)
- [Heap Data Structure](https://en.wikipedia.org/wiki/Heap_(data_structure))
