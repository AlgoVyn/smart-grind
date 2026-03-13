# Find K Pairs With Smallest Sums

## Problem Description

You are given two integer arrays nums1 and nums2 sorted in non-decreasing order and an integer k.
Define a pair (u, v) which consists of one element from the first array and one element from the second array.
Return the k pairs (u1, v1), (u2, v2), ..., (uk, vk) with the smallest sums.

**LeetCode Link:** [Find K Pairs With Smallest Sums - LeetCode](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/)

---

## Examples

### Example 1

**Input:**
```python
nums1 = [1,7,11], nums2 = [2,4,6], k = 3
```

**Output:**
```python
[[1,2],[1,4],[1,6]]
```

**Explanation:**
The first 3 pairs are returned from the sequence: [1,2],[1,4],[1,6],[7,2],[7,4],[11,2],[7,6],[11,4],[11,6]

### Example 2

**Input:**
```python
nums1 = [1,1,2], nums2 = [1,2,3], k = 2
```

**Output:**
```python
[[1,1],[1,1]]
```

**Explanation:**
The first 2 pairs are returned from the sequence: [1,1],[1,1],[1,2],[2,1],[1,2],[2,2],[1,3],[1,3],[2,3]

---

## Constraints

- 1 <= nums1.length, nums2.length <= 10^5
- -10^9 <= nums1[i], nums2[i] <= 10^9
- nums1 and nums2 both are sorted in non-decreasing order.
- 1 <= k <= 10^4
- k <= nums1.length * nums2.length

---

## Pattern: Heap-Based K-Way Merge (Priority Queue)

This problem uses the **Min-Heap** pattern to find the k smallest pairs. Start with the smallest pair (first elements from both arrays), then greedily expand to the next smallest pairs by pushing candidates (i+1, j) and (i, j+1) into the heap.

### Core Concept

- **Min-Heap**: Always extract the pair with smallest sum
- **Greedy Expansion**: From pair (i, j), next candidates are (i+1, j) and (i, j+1)
- **Visited Set**: Track visited pairs to avoid duplicates

### When to Use This Pattern

This pattern is applicable when:
1. Finding k smallest/largest elements from sorted arrays
2. Merging k sorted lists efficiently
3. Problems requiring ordered traversal with pruning

---

## Intuition

The key insight for this problem is leveraging the **sorted nature** of both arrays to avoid checking all possible pairs.

### Key Observations

1. **Smallest First**: The pair with smallest sum is always (nums1[0], nums2[0]) since both arrays are sorted.

2. **Next Best Candidates**: From any pair (i, j), the next smallest candidates are:
   - (i+1, j) - moving right in nums1
   - (i, j+1) - moving right in nums2

3. **No Need to Check All**: We only need O(k) heap operations since we stop after finding k pairs.

4. **Avoid Duplicates**: Using a visited set prevents adding the same pair multiple times.

### Algorithm Overview

1. Initialize heap with (nums1[0] + nums2[0], 0, 0)
2. While result has less than k pairs:
   - Pop smallest sum pair from heap
   - Add to result
   - Push (i+1, j) if not visited
   - Push (i, j+1) if not visited
3. Return result

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Min-Heap with Visited Set** - Standard approach
2. **Optimized without Visited Set** - More memory efficient

---

## Approach 1: Min-Heap with Visited Set (Standard)

### Algorithm Steps

1. If either array is empty, return empty result
2. Initialize heap with (nums1[0] + nums2[0], 0, 0) and visited set
3. While result size < k and heap not empty:
   - Pop smallest sum pair
   - Add to result
   - Push (i+1, j) if valid and not visited
   - Push (i, j+1) if valid and not visited
4. Return result

### Why It Works

This approach works because:
- The heap always gives us the smallest remaining sum
- From each pair, the next candidates are guaranteed to have the smallest increase
- The visited set prevents duplicate pairs

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        """
        Find k pairs with smallest sums from two sorted arrays.
        
        Args:
            nums1: First sorted array
            nums2: Second sorted array
            k: Number of pairs to return
            
        Returns:
            List of k pairs with smallest sums
        """
        if not nums1 or not nums2:
            return []
        
        # Min-heap: (sum, index_in_nums1, index_in_nums2)
        heap = []
        heapq.heappush(heap, (nums1[0] + nums2[0], 0, 0))
        
        # Track visited pairs
        visited = set()
        visited.add((0, 0))
        
        result = []
        
        while len(result) < k and heap:
            # Get pair with smallest sum
            _, i, j = heapq.heappop(heap)
            result.append([nums1[i], nums2[j]])
            
            # Push next candidates
            # Candidate 1: Move right in nums1
            if i + 1 < len(nums1) and (i + 1, j) not in visited:
                heapq.heappush(heap, (nums1[i + 1] + nums2[j], i + 1, j))
                visited.add((i + 1, j))
            
            # Candidate 2: Move right in nums2
            if j + 1 < len(nums2) and (i, j + 1) not in visited:
                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
                visited.add((i, j + 1))
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <set>
#include <tuple>
using namespace std;

class Solution {
public:
    vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {
        if (nums1.empty() || nums2.empty()) {
            return {};
        }
        
        // Min-heap: (sum, index_in_nums1, index_in_nums2)
        priority_queue<tuple<int, int, int>, 
                      vector<tuple<int, int, int>>, 
                      greater<tuple<int, int, int>>> pq;
        
        pq.emplace(nums1[0] + nums2[0], 0, 0);
        
        // Track visited pairs
        set<pair<int, int>> visited;
        visited.insert({0, 0});
        
        vector<vector<int>> result;
        
        while (!pq.empty() && result.size() < k) {
            auto [sum, i, j] = pq.top();
            pq.pop();
            
            result.push_back({nums1[i], nums2[j]});
            
            // Push next candidates
            if (i + 1 < nums1.size() && !visited.count({i + 1, j})) {
                pq.emplace(nums1[i + 1] + nums2[j], i + 1, j);
                visited.insert({i + 1, j});
            }
            
            if (j + 1 < nums2.size() && !visited.count({i, j + 1})) {
                pq.emplace(nums1[i] + nums2[j + 1], i, j + 1);
                visited.insert({i, j + 1});
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        if (nums1 == null || nums2 == null || nums1.length == 0 || nums2.length == 0) {
            return new ArrayList<>();
        }
        
        // Min-heap: (sum, index_in_nums1, index_in_nums2)
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        
        pq.offer(new int[]{nums1[0] + nums2[0], 0, 0});
        
        // Track visited pairs
        Set<String> visited = new HashSet<>();
        visited.add("0,0");
        
        List<List<Integer>> result = new ArrayList<>();
        
        while (!pq.isEmpty() && result.size() < k) {
            int[] curr = pq.poll();
            int i = curr[1];
            int j = curr[2];
            
            result.add(Arrays.asList(nums1[i], nums2[j]));
            
            // Push next candidates
            if (i + 1 < nums1.length && !visited.contains((i + 1) + "," + j)) {
                pq.offer(new int[]{nums1[i + 1] + nums2[j], i + 1, j});
                visited.add((i + 1) + "," + j);
            }
            
            if (j + 1 < nums2.length && !visited.contains(i + "," + (j + 1))) {
                pq.offer(new int[]{nums1[i] + nums2[j + 1], i, j + 1});
                visited.add(i + "," + (j + 1));
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number[][]}
 */
var kSmallestPairs = function(nums1, nums2, k) {
    if (!nums1 || !nums2 || nums1.length === 0 || nums2.length === 0) {
        return [];
    }
    
    // Min-heap: [sum, index_in_nums1, index_in_nums2]
    const pq = [];
    pq.push([nums1[0] + nums2[0], 0, 0]);
    
    // Track visited pairs
    const visited = new Set();
    visited.add("0,0");
    
    const result = [];
    
    while (pq.length > 0 && result.length < k) {
        // Sort to simulate min-heap (JS doesn't have built-in priority queue)
        pq.sort((a, b) => a[0] - b[0]);
        const [sum, i, j] = pq.shift();
        
        result.push([nums1[i], nums2[j]]);
        
        // Push next candidates
        if (i + 1 < nums1.length && !visited.has((i + 1) + "," + j)) {
            pq.push([nums1[i + 1] + nums2[j], i + 1, j]);
            visited.add((i + 1) + "," + j);
        }
        
        if (j + 1 < nums2.length && !visited.has(i + "," + (j + 1))) {
            pq.push([nums1[i] + nums2[j + 1], i, j + 1]);
            visited.add(i + "," + (j + 1));
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k log k) - heap operations are O(log k), we do up to k pops |
| **Space** | O(k) for heap and visited set |

---

## Approach 2: Optimized Without Visited Set

### Algorithm Steps

1. Limit nums1 to first k elements (can't have more than k pairs from nums1)
2. Initialize heap with (nums1[i] + nums2[0], i, 0) for all i in nums1
3. Pop k times, pushing (i, j+1) for each pop
4. Return result

### Why It Works

This approach leverages the fact that if we limit the first array to k elements, we won't need the visited set because:
- Each row (fixed i) is processed in increasing j order
- We never go back to a previous row once we've moved past it

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        """
        Optimized approach - limit nums1 to first k elements.
        """
        if not nums1 or not nums2:
            return []
        
        # Limit nums1 to first k elements (we can't have more than k pairs)
        m, n = min(len(nums1), k), len(nums2)
        
        # Initialize heap with first column
        heap = [(nums1[i] + nums2[0], i, 0) for i in range(m)]
        heapq.heapify(heap)
        
        result = []
        
        while heap and len(result) < k:
            sum_, i, j = heapq.heappop(heap)
            result.append([nums1[i], nums2[j]])
            
            if j + 1 < n:
                heapq.heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<vector<int>> kSmallestPairs(vector<int>& nums1, vector<int>& nums2, int k) {
        if (nums1.empty() || nums2.empty()) {
            return {};
        }
        
        // Limit nums1 to first k elements
        int m = min((int)nums1.size(), k);
        int n = nums2.size();
        
        // Min-heap
        priority_queue<tuple<int, int, int>,
                      vector<tuple<int, int, int>>,
                      greater<tuple<int, int, int>>> pq;
        
        // Initialize with first column
        for (int i = 0; i < m; i++) {
            pq.emplace(nums1[i] + nums2[0], i, 0);
        }
        
        vector<vector<int>> result;
        
        while (!pq.empty() && result.size() < k) {
            auto [sum, i, j] = pq.top();
            pq.pop();
            
            result.push_back({nums1[i], nums2[j]});
            
            if (j + 1 < n) {
                pq.emplace(nums1[i] + nums2[j + 1], i, j + 1);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
        if (nums1 == null || nums2 == null || nums1.length == 0 || nums2.length == 0) {
            return new ArrayList<>();
        }
        
        // Limit nums1 to first k elements
        int m = Math.min(nums1.length, k);
        int n = nums2.length;
        
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[0], b[0]));
        
        // Initialize with first column
        for (int i = 0; i < m; i++) {
            pq.offer(new int[]{nums1[i] + nums2[0], i, 0});
        }
        
        List<List<Integer>> result = new ArrayList<>();
        
        while (!pq.isEmpty() && result.size() < k) {
            int[] curr = pq.poll();
            int i = curr[1];
            int j = curr[2];
            
            result.add(Arrays.asList(nums1[i], nums2[j]));
            
            if (j + 1 < n) {
                pq.offer(new int[]{nums1[i] + nums2[j + 1], i, j + 1});
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @param {number} k
 * @return {number[][]}
 */
var kSmallestPairs = function(nums1, nums2, k) {
    if (!nums1 || !nums2 || nums1.length === 0 || nums2.length === 0) {
        return [];
    }
    
    // Limit nums1 to first k elements
    const m = Math.min(nums1.length, k);
    const n = nums2.length;
    
    // Initialize heap with first column
    const heap = [];
    for (let i = 0; i < m; i++) {
        heap.push([nums1[i] + nums2[0], i, 0]);
    }
    heap.sort((a, b) => a[0] - b[0]);
    
    const result = [];
    
    while (heap.length > 0 && result.length < k) {
        const [sum, i, j] = heap.shift();
        result.push([nums1[i], nums2[j]]);
        
        if (j + 1 < n) {
            heap.push([nums1[i] + nums2[j + 1], i, j + 1]);
            heap.sort((a, b) => a[0] - b[0]);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k log m) where m = min(k, len(nums1)) |
| **Space** | O(m) for heap |

---

## Comparison of Approaches

| Aspect | Heap + Visited | Optimized |
|--------|---------------|-----------|
| **Time Complexity** | O(k log k) | O(k log m) |
| **Space Complexity** | O(k) | O(m) |
| **Implementation** | Standard | Slightly simpler |
| **Best For** | General case | When m << n |

**Best Approach:** Use either approach - both are efficient. The optimized version uses less memory when one array is much larger.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Heap/Priority Queue, Greedy algorithms, Two pointers

### Learning Outcomes

1. **Heap Mastery**: Learn to use heap for k smallest elements
2. **Greedy Thinking**: Understand optimal expansion strategy
3. **Optimization**: Learn to reduce search space using array properties

---

## Related Problems

Based on similar themes (heap, k smallest elements):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Kth Smallest Element in a Sorted Matrix | [Link](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/) | Similar matrix search |
| Find K Closest Elements | [Link](https://leetcode.com/problems/find-k-closest-elements/) | K closest in sorted array |
| Ugly Number II | [Link](https://leetcode.com/problems/ugly-number-ii/) | Heap-based generation |

### Pattern Reference

For more detailed explanations of the Heap pattern, see:
- **[Heap Pattern](/patterns/heap)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Find K Pairs With Smallest Sums - NeetCode](https://www.youtube.com/watch?v=OT2N3c2E0wE)** - Clear explanation
2. **[LeetCode 373 - Find K Pairs With Smallest Sums](https://www.youtube.com/watch?v=1L0K2aS7E44)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution to find the k largest pairs instead of smallest?

**Answer:** Use a max-heap instead of min-heap, or negate the sums when pushing to min-heap.

---

### Q2: What if the arrays are not sorted?

**Answer:** Sort them first (O(n log n)), then apply the same algorithm. Sorting is necessary because the algorithm relies on the sorted property.

---

### Q3: How would you handle duplicate values in the arrays?

**Answer:** The algorithm naturally handles duplicates - each pair is considered based on its indices. The visited set or optimized approach ensures we don't process the same pair twice.

---

### Q4: Can you solve this without using a heap?

**Answer:** Yes, you could generate all pairs and sort them (O(mn log(mn))), but this is much slower than the heap approach.

---

## Common Pitfalls

### 1. Not Handling Empty Arrays
**Issue**: Return empty list if either nums1 or nums2 is empty.

**Solution**: Add early return check at the beginning.

### 2. Duplicate Pairs in Heap
**Issue**: Use a visited set to avoid adding the same (i, j) pair multiple times.

**Solution**: Track visited pairs or use the optimized approach.

### 3. Heap Size Growing Unbounded
**Issue**: The heap can grow up to O(k) in worst case, but this is acceptable.

**Solution**: No fix needed - this is expected behavior.

### 4. Index Boundary Confusion
**Issue**: Always check array length boundaries before pushing new candidates.

**Solution**: Always check `i + 1 < len(nums1)` and `j + 1 < len(nums2)`.

### 5. Not Stopping When k Pairs Found
**Issue**: Break when result has k pairs or heap is empty.

**Solution**: Use `while len(result) < k and heap:` condition.

---

## Summary

The **Find K Pairs With Smallest Sums** problem demonstrates the power of heap-based optimization:

Key takeaways:
1. Leverage sorted arrays to avoid checking all pairs
2. Use min-heap to always get the smallest remaining sum
3. Greedily expand to next candidates (i+1, j) and (i, j+1)
4. Use visited set or optimized approach to avoid duplicates

This problem is essential for understanding heap-based k-element selection problems.

### Pattern Summary

This problem exemplifies the **Heap-Based K-Way Merge** pattern, characterized by:
- Using priority queue for ordered extraction
- Greedy expansion from current best
- Efficient pruning using problem properties
- Applications in sorted array merging and k-selection problems

For more details on this pattern, see the **[Heap Pattern](/patterns/heap)**.

---

## Additional Resources

- [LeetCode Problem 373](https://leetcode.com/problems/find-k-pairs-with-smallest-sums/) - Official problem page
- [Heap Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/heap-data-structure/) - Detailed explanation
- [Pattern: Heap](/patterns/heap) - Comprehensive pattern guide
