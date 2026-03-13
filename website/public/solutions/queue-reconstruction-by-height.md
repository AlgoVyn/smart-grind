# Queue Reconstruction By Height

## LeetCode Link

[LeetCode 406 - Queue Reconstruction by Height](https://leetcode.com/problems/queue-reconstruction-by-height/)

---

## Problem Description

You are given an array of people, `people`, which are the attributes of some people in the queue (not necessarily in order). Each `people[i] = [hi, ki]` represents the ith person of height `hi` with exactly `ki` other people in front who have a height greater than or equal to `hi`.

Reconstruct and return the queue that is represented by the input array `people`. The returned queue should be formatted as an array `queue`, where `queue[j] = [hj, kj]` is the attributes of the jth person in the queue (`queue[0]` is the person at the front of the queue).

---

## Examples

### Example 1

**Input:**
```
people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]
```

**Output:**
```
[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]
```

**Explanation:**
- Person 0 has height 5 with no other people taller or the same height in front.
- Person 1 has height 7 with no other people taller or the same height in front.
- Person 2 has height 5 with two persons taller or the same height in front, which is person 0 and 1.
- Person 3 has height 6 with one person taller or the same height in front, which is person 1.
- Person 4 has height 4 with four people taller or the same height in front, which are people 0, 1, 2, and 3.
- Person 5 has height 7 with one person taller or the same height in front, which is person 1.

Hence `[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]` is the reconstructed queue.

### Example 2

**Input:**
```
people = [[6,0],[5,0],[4,0],[3,2],[2,2],[1,4]]
```

**Output:**
```
[[4,0],[5,0],[2,2],[3,2],[1,4],[6,0]]
```

---

## Constraints

- `1 <= people.length <= 2000`
- `0 <= hi <= 10^6`
- `0 <= ki < people.length`
- It is guaranteed that the queue can be reconstructed.

---

## Pattern: Greedy Sorting with Insertion

This problem uses the **Greedy** pattern with sorting and insertion. Sort people by height descending, then by k ascending. Insert each person at their k index.

---

## Intuition

The key insight for this problem is understanding how to reconstruct the queue given height and "people in front" information:

### Key Observations

1. **Height Priority**: Taller people see shorter people as not blocking their view. So process taller people first.

2. **K Value Interpretation**: k represents how many people in front have height >= current person's height.

3. **Greedy Insertion**: After sorting by height (descending), when we insert a person at index k, all already inserted people have height >= current person's height. So inserting at position k places exactly k people before them.

4. **Sorting Strategy**: 
   - Primary: Height descending (tallest first)
   - Secondary: k ascending (for same height, smaller k first)

### Algorithm Overview

1. **Sort**: Sort people by height descending, then by k ascending
2. **Insert**: For each person in sorted order, insert at index = k
3. **Return**: The result list is now correctly reconstructed

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Greedy with Insertion** - Standard optimal solution
2. **Using Linked List** - Alternative implementation

---

## Approach 1: Greedy with Insertion (Optimal)

### Algorithm Steps

1. Sort people by (-height, k)
2. Create empty result list
3. For each person in sorted order:
   - Insert at position = person's k value
4. Return result list

### Why It Works

When inserting people from tallest to shortest, all people already in the result are taller or equal to the current person. Inserting at position k means exactly k taller/equal people are in front, which is exactly what k represents.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def reconstructQueue(self, people: List[List[int]]) -> List[List[int]]:
        # Sort by height descending, then by k ascending
        people.sort(key=lambda x: (-x[0], x[1]))
        
        # Insert each person at their k index
        res = []
        for p in people:
            res.insert(p[1], p)
        
        return res
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> reconstructQueue(vector<vector<int>>& people) {
        // Sort by height descending, then by k ascending
        sort(people.begin(), people.end(), [](const vector<int>& a, const vector<int>& b) {
            if (a[0] != b[0]) return a[0] > b[0];  // height descending
            return a[1] < b[1];  // k ascending
        });
        
        // Insert each person at their k index
        vector<vector<int>> res;
        for (const auto& p : people) {
            res.insert(res.begin() + p[1], p);
        }
        
        return res;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[][] reconstructQueue(int[][] people) {
        // Sort by height descending, then by k ascending
        Arrays.sort(people, (a, b) -> {
            if (a[0] != b[0]) return b[0] - a[0];  // height descending
            return a[1] - b[1];  // k ascending
        });
        
        // Insert each person at their k index
        List<int[]> res = new ArrayList<>();
        for (int[] p : people) {
            res.add(p[1], p);
        }
        
        return res.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} people
 * @return {number[][]}
 */
var reconstructQueue = function(people) {
    // Sort by height descending, then by k ascending
    people.sort((a, b) => {
        if (a[0] !== b[0]) return b[0] - a[0];  // height descending
        return a[1] - b[1];  // k ascending
    });
    
    // Insert each person at their k index
    const res = [];
    for (const p of people) {
        res.splice(p[1], 0, p);
    }
    
    return res;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) — sorting O(n log n) + n insertions at O(n) each |
| **Space** | O(n) — result list |

---

## Approach 2: Using LinkedList (Alternative)

### Algorithm Steps

1. Sort people similarly
2. Use LinkedList for O(1) insertion

### Why It Works

Same logic as Approach 1 but using LinkedList for potentially better insertion performance. However, in practice, the difference is minimal.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def reconstructQueue(self, people: List[List[int]]) -> List[List[int]]:
        people.sort(key=lambda x: (-x[0], x[1]))
        
        # Using deque for O(1) insertions at arbitrary positions
        queue = deque()
        for p in people:
            queue.appendleft(p)
            # Rotate to position k
            for _ in range(len(queue) - 1 - p[1]):
                item = queue.popleft()
                queue.append(item)
        
        # Convert to list maintaining reverse order
        result = []
        while queue:
            result.append(queue.pop())
        
        return result[::-1]
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Greedy + Insertion | LinkedList Alternative |
|--------|-------------------|------------------------|
| **Time Complexity** | O(n²) | O(n²) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | More complex |

**Best Approach:** Use Approach 1 (Greedy + Insertion) for simplicity and clarity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Greedy algorithm, Sorting, List manipulation

### Learning Outcomes

1. **Greedy Algorithm**: Understand greedy approach for reconstruction problems
2. **Sorting Strategy**: Learn complex sorting with multiple keys
3. **Insertion Pattern**: Master list insertion for position-based problems

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Candy | [Link](https://leetcode.com/problems/candy/) | Similar greedy reconstruction |
| Task Scheduler | [Link](https://leetcode.com/problems/task-scheduler/) | Greedy scheduling |
| Rearrange String | [Link](https://leetcode.com/problems/rearrange-string-k-distance-apart/) | String reconstruction |

### Pattern Reference

For more detailed explanations, see:
- **[Greedy Pattern - Jump Game](/patterns/greedy-jump-game-reachability-minimization)**

---

## Video Tutorial Links

1. **[NeetCode - Queue Reconstruction by Height](https://www.youtube.com/watch?v=7m1k1JXfPTI)** - Clear explanation
2. **[Greedy Algorithm Tutorial](https://www.youtube.com/watch?v=bC7o8OD21E8)** - Understanding greedy approach

---

## Follow-up Questions

### Q1: How would you modify the solution if k represented people strictly taller (not >=)?

**Answer:** The solution would need significant modification. The current approach relies on the >= relationship. You'd need to process people of same height differently or use a different data structure.

---

### Q2: What if heights could be negative?

**Answer:** The algorithm would work the same way - only the sorting logic changes. The insertion logic remains valid.

---

### Q3: How would you handle duplicate heights with different k values?

**Answer:** The secondary sort by k ascending handles this. People with same height are processed in order of increasing k, ensuring correct placement.

---

### Q4: Can you solve this using recursion?

**Answer:** Not naturally - this is an inherently iterative problem. The greedy insertion relies on building the result incrementally.

---

## Common Pitfalls

### 1. Sort Order
**Issue**: Must sort by height DESC (largest first), then by k ASC - getting this wrong breaks the solution.

**Solution**: Use `sort(key=lambda x: (-x[0], x[1]))` in Python.

### 2. Insertion Position
**Issue**: Use the k value directly as the insertion index, not k-1.

**Solution**: The k value IS the correct index (0-based).

### 3. Time Complexity
**Issue**: Using list.insert() is O(n), making overall O(n²) - this is expected and acceptable.

**Solution**: This is the optimal solution; no need to optimize further for this problem size.

---

## Summary

The **Queue Reconstruction by Height** problem demonstrates the power of greedy algorithms:

- **Greedy Approach**: Process tallest people first, insert at k position
- **Sorting Strategy**: Height descending, then k ascending
- **O(n²) Solution**: Expected due to insertion operations
- **Elegant Solution**: Simple logic achieves correct result

Key takeaways:
1. Sort by height descending, then by k ascending
2. Insert each person at position = k
3. All already inserted people are taller/equal, so k is correct
4. O(n²) time complexity is acceptable

This problem is excellent for learning greedy reconstruction problems.

### Pattern Summary

This problem exemplifies the **Greedy Reconstruction** pattern, characterized by:
- Sorting to determine processing order
- Insertion at specific positions
- Building solution incrementally
- O(n²) time complexity

---

## Additional Resources

- [LeetCode 406 - Queue Reconstruction by Height](https://leetcode.com/problems/queue-reconstruction-by-height/) - Official problem page
- [Greedy Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/) - Greedy algorithm basics
- [Pattern: Greedy](/patterns/greedy-jump-game-reachability-minimization) - Related pattern
