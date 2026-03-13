# Minimum Cost To Hire K Workers

## Problem Description

There are `n` workers. You are given two integer arrays `quality` and `wage` where `quality[i]` is the quality of the `i-th` worker and `wage[i]` is the minimum wage expectation for the `i-th` worker.

We want to hire exactly `k` workers to form a paid group. To hire a group of `k` workers, we must pay them according to the following rules:

1. Every worker in the paid group must be paid at least their minimum wage expectation.
2. In the group, each worker's pay must be directly proportional to their quality. This means if a worker's quality is double that of another worker in the group, then they must be paid twice as much as the other worker.

Given the integer `k`, return the least amount of money needed to form a paid group satisfying the above conditions. Answers within `10^-5` of the actual answer will be accepted.

**LeetCode Link:** [LeetCode 857 - Minimum Cost to Hire K Workers](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/)

---

## Examples

### Example 1

**Input:**
```python
quality = [10, 20, 5], wage = [70, 50, 30], k = 2
```

**Output:**
```python
105.00000
```

**Explanation:**
We need to pay at least the minimum wage to each worker. We also need to maintain proportional pay based on quality. The best solution is:
- Worker 0: quality=10, ratio=7.0, pay=70
- Worker 2: quality=5, ratio=6.0, pay=35

Total = 70 + 35 = 105

### Example 2

**Input:**
```python
quality = [3, 1, 10, 10, 1], wage = [4, 8, 2, 2, 7], k = 3
```

**Output:**
```python
30.66667
```

**Explanation:**
We pay worker 0 (ratio=1.33) more than minimum, and workers 2 and 3 (ratio=0.2) proportionally. The total cost is 30.66667.

---

## Constraints

- `n == quality.length == wage.length`
- `1 <= k <= n <= 10^4`
- `1 <= quality[i], wage[i] <= 10^4`

---

## Pattern: Heap-based Greedy with Ratio Sorting

This problem uses a **greedy approach** with a max-heap. The key insight is that the optimal group has workers sorted by wage/quality ratio. We sort by ratio, then use a max-heap to maintain the k workers with smallest total quality. The cost is `total_quality * max_ratio_in_group`.

---

## Intuition

The key insight for this problem is understanding the relationship between quality, wage, and proportional pay:

> For any group of workers, the total cost = total_quality × (maximum wage/quality ratio in the group)

### Key Observations

1. **Ratio as Minimum Pay Rate**: Each worker has a minimum "pay rate" = wage[i] / quality[i]. To hire a worker, we must pay at least this rate.

2. **Proportional Pay**: If we pay one worker at rate R, all workers in the group must be paid at rate R (or higher).

3. **Optimal Group Property**: In an optimal group, all workers are paid at the **maximum ratio** among them. This is because:
   - If we pay at a higher rate, everyone's cost increases
   - If we pay at a lower rate, at least one worker gets less than their minimum

4. **Sorting by Ratio**: If we sort workers by their ratio and consider groups in order:
   - When we pick a worker with ratio R, all previously considered workers have ratio ≤ R
   - The cost for any group ending at this worker is: total_quality × R
   - To minimize cost, we want smallest total_quality among the k workers

5. **Max-Heap for Quality**: Use a max-heap to keep track of k workers with smallest total quality.

### Algorithm Overview

1. **Sort by ratio**: Sort workers by wage/quality ratio ascending
2. **Iterate and maintain heap**: For each worker (in ratio order):
   - Add to max-heap of qualities
   - Track total quality
   - When heap exceeds k, remove largest quality
   - When heap has k workers, calculate cost: total_quality × current_ratio
3. **Return minimum cost**

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Heap-based Greedy** - Optimal solution
2. **Brute Force with Optimization** - For understanding (O(n²k))

---

## Approach 1: Heap-based Greedy (Optimal)

### Algorithm Steps

1. Create worker pairs (quality, wage) and sort by ratio
2. Use a max-heap to maintain k smallest qualities
3. Track total quality as we add workers
4. Calculate cost when we have k workers

### Why It Works

By processing workers in order of increasing ratio, when we reach worker i with ratio R, all workers before i have ratio ≤ R. Any valid group ending at i must pay at least R to all its members. To minimize cost, we choose k workers with smallest total quality.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def mincostToHireWorkers(self, quality: List[int], wage: List[int], k: int) -> float:
        """
        Find the minimum cost to hire k workers.
        
        Strategy: Sort workers by wage/quality ratio and use a max-heap
        to maintain the k workers with the lowest total quality.
        
        Args:
            quality: List of worker qualities
            wage: List of minimum wage expectations
            k: Number of workers to hire
            
        Returns:
            Minimum cost to hire k workers
        """
        # Sort workers by their wage-to-quality ratio
        workers = sorted(zip(quality, wage), key=lambda x: x[1] / x[0])
        
        # Max-heap (negatives) for qualities
        heap = []
        total_q = 0
        ans = float('inf')
        
        for q, w in workers:
            # Add current worker's quality to heap
            heapq.heappush(heap, -q)
            total_q += q
            
            # Keep only k smallest qualities
            if len(heap) > k:
                # Remove largest quality (most negative in heap)
                removed = heapq.heappop(heap)
                total_q += removed  # removed is negative
            
            # When we have k workers, calculate cost
            if len(heap) == k:
                # Cost = total quality * current ratio (max ratio in group)
                ratio = w / q
                ans = min(ans, total_q * ratio)
        
        return ans
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <heap>
using namespace std;

class Solution {
public:
    double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {
        // Create workers with (quality, wage, ratio)
        vector<tuple<double, int, int>> workers;
        int n = quality.size();
        
        for (int i = 0; i < n; i++) {
            double ratio = (double)wage[i] / quality[i];
            workers.emplace_back(ratio, quality[i], wage[i]);
        }
        
        // Sort by ratio
        sort(workers.begin(), workers.end());
        
        // Max-heap for qualities (use min-heap with negative values)
        priority_queue<int> maxHeap;
        double totalQ = 0;
        double ans = 1e18;
        
        for (auto [ratio, q, w] : workers) {
            maxHeap.push(q);
            totalQ += q;
            
            if (maxHeap.size() > k) {
                totalQ -= maxHeap.top();
                maxHeap.pop();
            }
            
            if (maxHeap.size() == k) {
                ans = min(ans, totalQ * ratio);
            }
        }
        
        return ans;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public double mincostToHireWorkers(int[] quality, int[] wage, int k) {
        int n = quality.length;
        
        // Create workers with ratio and sort
        List<double[]> workers = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            workers.add(new Double[]{ (double)wage[i] / quality[i], (double)quality[i], (double)wage[i]});
        }
        
        workers.sort(Comparator.comparingDouble(a -> a[0]));
        
        // Max-heap for qualities (use PriorityQueue with reverse order)
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Comparator.reverseOrder());
        double totalQ = 0;
        double ans = Double.MAX_VALUE;
        
        for (double[] worker : workers) {
            double ratio = worker[0];
            int q = (int)worker[1];
            
            maxHeap.offer(q);
            totalQ += q;
            
            if (maxHeap.size() > k) {
                totalQ -= maxHeap.poll();
            }
            
            if (maxHeap.size() == k) {
                ans = Math.min(ans, totalQ * ratio);
            }
        }
        
        return ans;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} quality
 * @param {number[]} wage
 * @param {number} k
 * @return {number}
 */
var mincostToHireWorkers = function(quality, wage, k) {
    // Create workers with ratio and sort
    const workers = quality.map((q, i) => ({
        ratio: wage[i] / q,
        quality: q,
        wage: wage[i]
    })).sort((a, b) => a.ratio - b.ratio);
    
    // Max-heap for qualities (use negative values for max-heap behavior)
    const maxHeap = [];
    let totalQ = 0;
    let ans = Infinity;
    
    for (const worker of workers) {
        // Push negative quality for max-heap
        maxHeap.push(-worker.quality);
        totalQ += worker.quality;
        
        if (maxHeap.length > k) {
            const removed = maxHeap.pop();
            totalQ += removed;  // removed is negative
        }
        
        if (maxHeap.length === k) {
            ans = Math.min(ans, totalQ * worker.ratio);
        }
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - dominated by sorting, heap operations are O(log k) |
| **Space** | O(n) for the heap and sorted list |

---

## Approach 2: Brute Force with Pruning (For Understanding)

### Algorithm Steps

1. Consider all combinations of k workers
2. For each group, calculate the required ratio (max ratio in group)
3. Calculate cost = total_quality × max_ratio
4. Return minimum

### Why It Works

This is a brute force approach that checks all possible groups. It's exponentially slow but helps understand why the greedy approach works.

### Code Implementation

````carousel
```python
from typing import List
from itertools import combinations

class Solution:
    def mincostToHireWorkers(self, quality: List[int], wage: List[int], k: int) -> float:
        n = len(quality)
        ans = float('inf')
        
        # Try all combinations of k workers
        for indices in combinations(range(n), k):
            # Calculate max ratio in this group
            max_ratio = max(wage[i] / quality[i] for i in indices)
            total_quality = sum(quality[i] for i in indices)
            
            # Calculate cost: total_quality * max_ratio
            cost = total_quality * max_ratio
            ans = min(ans, cost)
        
        return ans
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;

class Solution {
public:
    double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {
        int n = quality.size();
        double ans = 1e18;
        
        // Try all combinations - simplified for illustration
        // Note: This is O(n choose k) which is very slow
        
        return ans;
    }
};
```

<!-- slide -->
```java
class Solution {
    public double mincostToHireWorkers(int[] quality, int[] wage, int k) {
        // Brute force approach - O(n choose k) which is too slow
        // Not practical for large n
        return 0.0;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} quality
 * @param {number[]} wage
 * @param {number} k
 * @return {number}
 */
var mincostToHireWorkers = function(quality, wage, k) {
    // Brute force approach - O(n choose k) which is too slow
    // Only for understanding the concept
    return 0;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n choose k) - exponentially slow |
| **Space** | O(k) for temporary storage |

---

## Comparison of Approaches

| Aspect | Heap-based Greedy | Brute Force |
|--------|------------------|-------------|
| **Time Complexity** | O(n log n) | O(n choose k) |
| **Space Complexity** | O(n) | O(k) |
| **Practical** | ✅ Yes | ❌ No |
| **Difficulty** | Medium | Easy (but slow) |

**Best Approach:** Use the heap-based greedy approach. It's optimal and practical.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Goldman Sachs
- **Difficulty**: Hard
- **Concepts Tested**: Greedy, Heap, Sorting, Mathematical Reasoning

### Learning Outcomes

1. **Ratio-based Sorting**: Learn to sort by computed ratios
2. **Heap in Greedy**: Master using heaps in greedy algorithms
3. **Mathematical Insight**: Understand the cost formula

---

## Related Problems

Based on similar themes (Greedy, Heap, Ratio problems):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Largest Sum After Negating | [Link](https://leetcode.com/problems/largest-sum-after-negating/) | Greedy with sorting |
| Task Scheduler | [Link](https://leetcode.com/problems/task-scheduler/) | Greedy with heap |
| Reorganize String | [Link](https://leetcode.com/problems/reorganize-string/) | Greedy with counting |

### Pattern Reference

For more detailed explanations of the Greedy pattern, see:
- **[Greedy Pattern](/patterns/greedy)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Minimum Cost to Hire K Workers](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Heap-based Greedy Explained](https://www.youtube.com/watch?v=example)** - Detailed walkthrough
3. **[LeetCode 857 Solution](https://www.youtube.com/watch?v=example)** - Full solution

---

## Follow-up Questions

### Q1: How would you modify the solution to hire exactly k workers with maximum total quality?

**Answer:** This becomes a different optimization problem. We'd sort by quality descending and pick top k, but must also satisfy wage constraints. It becomes a more complex problem.

---

### Q2: What if workers could be paid different rates (not proportional to each other)?

**Answer:** The problem statement requires proportional pay. If we could pay different rates, we'd simply pay each worker their minimum wage, but this violates the proportional requirement.

---

### Q3: How does the solution handle workers with the same ratio?

**Answer:** Workers with the same ratio can be in any order. The algorithm handles them correctly since they're processed together.

---

### Q4: Can you use a min-heap instead of max-heap?

**Answer:** Yes, but you'd need to store negative quality values to simulate a max-heap (as in the Python implementation). Alternatively, you could sort qualities in descending order.

---

## Common Pitfalls

### 1. Wrong Ratio Sorting
**Issue**: Sorting by quality or wage alone instead of wage/quality ratio.

**Solution**: Always sort by `wage[i] / quality[i]` ascending.

### 2. Using Min-heap Instead of Max-heap
**Issue**: Need max-heap to remove largest quality when heap exceeds k.

**Solution**: Use negative values in Python or PriorityQueue with reverse order in Java.

### 3. Wrong Ratio for Cost Calculation
**Issue**: Using wrong ratio for cost.

**Solution**: Cost = total_quality × current_worker's_ratio (the maximum ratio in the group).

### 4. Floating Point Precision
**Issue**: Division precision issues.

**Solution**: Use float division; precision within 10^-5 is acceptable.

---

## Summary

The **Minimum Cost to Hire K Workers** problem demonstrates the power of combining **sorting by ratio** with **heap-based greedy** selection.

Key takeaways:
1. Sort workers by wage/quality ratio
2. Use max-heap to maintain k smallest qualities
3. Cost = total_quality × max_ratio_in_group
4. Time complexity O(n log n) is optimal

This problem is essential for understanding how to combine multiple algorithmic techniques (sorting + heap + greedy) to solve complex optimization problems.

### Pattern Summary

This problem exemplifies the **Heap-based Greedy** pattern, characterized by:
- Sorting by a computed ratio
- Maintaining k smallest elements with a heap
- Greedy selection based on computed values

For more details on this pattern and its variations, see the **[Greedy Pattern](/patterns/greedy)**.

---

## Additional Resources

- [LeetCode Problem 857](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/) - Official problem page
- [Greedy Algorithms - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/) - Detailed greedy explanation
- [Pattern: Greedy](/patterns/greedy) - Comprehensive pattern guide
