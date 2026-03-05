# Heap - Scheduling / Minimum Cost (Greedy with Priority Queue)

## Problem Description

This pattern combines greedy algorithms with priority queues to solve optimization problems where decisions must be made at each step to minimize total cost or maximize efficiency. It uses a heap to always select the next best option based on current criteria, making locally optimal choices that lead to globally optimal solutions.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(N log K) where K is heap size constraint |
| Space Complexity | O(K) for the heap |
| Input | Tasks, costs, or items with priorities |
| Output | Optimized schedule, minimum cost, or selected items |
| Approach | Greedy choice with heap-based selection |

### When to Use

- Scheduling tasks with priorities or deadlines
- Resource allocation problems
- Selecting top/bottom K elements dynamically
- Minimum cost worker selection
- Problems requiring sequential decision-making
- When greedy choice property holds

## Intuition

The key insight is that the greedy choice property allows us to make the locally optimal choice at each step, and the heap efficiently maintains the best options.

The "aha!" moments:

1. **Greedy choice**: At each step, choose what looks best now
2. **Heap maintains candidates**: Efficiently track and update best options
3. **Constraint enforcement**: Use heap size to enforce limits (top K, etc.)
4. **Dynamic updates**: Costs/priorities can change during execution
5. **Optimal substructure**: Greedy + optimal substructure = global optimum

## Solution Approaches

### Approach 1: Minimum Cost to Hire K Workers ✅ Recommended

#### Algorithm

1. Calculate ratio (quality / wage) for each worker
2. Sort workers by ratio ascending
3. Use max-heap to track qualities of selected workers
4. Iterate through sorted workers:
   - Push quality to max-heap
   - If heap size > K, pop largest quality
   - If heap size == K, calculate total cost = ratio * sum(qualities)
   - Track minimum cost
5. Return minimum cost

#### Implementation

````carousel
```python
import heapq

def mincost_to_hire_workers(quality: list[int], wage: list[int], k: int) -> float:
    """
    Minimum cost to hire K workers.
    LeetCode 857 - Minimum Cost to Hire K Workers
    Time: O(n log n), Space: O(n)
    """
    workers = sorted([(w / q, q) for w, q in zip(wage, quality)])
    
    # Max heap for qualities (negate for Python)
    max_heap = []
    quality_sum = 0
    min_cost = float('inf')
    
    for ratio, q in workers:
        heapq.heappush(max_heap, -q)
        quality_sum += q
        
        # Keep only K smallest qualities
        if len(max_heap) > k:
            quality_sum += heapq.heappop(max_heap)  # Remove largest
        
        # Calculate cost if we have K workers
        if len(max_heap) == k:
            min_cost = min(min_cost, quality_sum * ratio)
    
    return min_cost


def mincost_to_hire_workers_verbose(quality, wage, k):
    """
    Detailed version with comments.
    """
    n = len(quality)
    
    # Create workers with their ratio (wage/quality)
    workers = []
    for i in range(n):
        ratio = wage[i] / quality[i]
        workers.append((ratio, quality[i]))
    
    # Sort by ratio ascending
    workers.sort()
    
    # Max heap to keep track of K smallest qualities
    qualities = []
    total_quality = 0
    min_cost = float('inf')
    
    for ratio, q in workers:
        # Add current worker
        heapq.heappush(qualities, -q)
        total_quality += q
        
        # If exceeded K, remove worker with largest quality
        if len(qualities) > k:
            removed = -heapq.heappop(qualities)
            total_quality -= removed
        
        # Calculate cost if we have exactly K workers
        if len(qualities) == k:
            cost = total_quality * ratio
            min_cost = min(min_cost, cost)
    
    return min_cost
```
<!-- slide -->
```cpp
class Solution {
public:
    double mincostToHireWorkers(vector<int>& quality, vector<int>& wage, int k) {
        int n = quality.size();
        vector<pair<double, int>> workers;  // {ratio, quality}
        
        for (int i = 0; i < n; i++) {
            workers.push_back({(double)wage[i] / quality[i], quality[i]});
        }
        
        sort(workers.begin(), workers.end());
        
        priority_queue<int> maxHeap;  // max heap for qualities
        int qualitySum = 0;
        double minCost = DBL_MAX;
        
        for (auto& [ratio, q] : workers) {
            maxHeap.push(q);
            qualitySum += q;
            
            if (maxHeap.size() > k) {
                qualitySum -= maxHeap.top();
                maxHeap.pop();
            }
            
            if (maxHeap.size() == k) {
                minCost = min(minCost, qualitySum * ratio);
            }
        }
        
        return minCost;
    }
};
```
<!-- slide -->
```java
class Solution {
    public double mincostToHireWorkers(int[] quality, int[] wage, int k) {
        int n = quality.length;
        double[][] workers = new double[n][2];  // [ratio, quality]
        
        for (int i = 0; i < n; i++) {
            workers[i][0] = (double) wage[i] / quality[i];
            workers[i][1] = quality[i];
        }
        
        Arrays.sort(workers, (a, b) -> Double.compare(a[0], b[0]));
        
        PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());
        int qualitySum = 0;
        double minCost = Double.MAX_VALUE;
        
        for (double[] worker : workers) {
            double ratio = worker[0];
            int q = (int) worker[1];
            
            maxHeap.offer(q);
            qualitySum += q;
            
            if (maxHeap.size() > k) {
                qualitySum -= maxHeap.poll();
            }
            
            if (maxHeap.size() == k) {
                minCost = Math.min(minCost, qualitySum * ratio);
            }
        }
        
        return minCost;
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
function mincostToHireWorkers(quality, wage, k) {
    const n = quality.length;
    const workers = [];
    
    for (let i = 0; i < n; i++) {
        workers.push([wage[i] / quality[i], quality[i]]);
    }
    
    workers.sort((a, b) => a[0] - b[0]);
    
    const maxHeap = [];
    let qualitySum = 0;
    let minCost = Infinity;
    
    for (const [ratio, q] of workers) {
        maxHeap.push(q);
        maxHeap.sort((a, b) => b - a);  // Max heap
        qualitySum += q;
        
        if (maxHeap.length > k) {
            qualitySum -= maxHeap.shift();
        }
        
        if (maxHeap.length === k) {
            minCost = Math.min(minCost, qualitySum * ratio);
        }
    }
    
    return minCost;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - Sorting + heap operations |
| Space | O(n) - Workers array and heap |

### Approach 2: IPO (Maximize Capital)

#### Implementation

````carousel
```python
import heapq

def find_maximized_capital(k: int, w: int, profits: list[int], capital: list[int]) -> int:
    """
    LeetCode 502 - IPO
    Maximize capital by selecting at most k projects.
    Time: O(n log n), Space: O(n)
    """
    n = len(profits)
    projects = sorted(zip(capital, profits))  # Sort by capital required
    
    # Max heap for available projects' profits
    available = []
    project_idx = 0
    
    for _ in range(k):
        # Add all projects we can afford
        while project_idx < n and projects[project_idx][0] <= w:
            heapq.heappush(available, -projects[project_idx][1])
            project_idx += 1
        
        # Pick most profitable available project
        if available:
            w += -heapq.heappop(available)
        else:
            break
    
    return w
```
<!-- slide -->
```cpp
class Solution {
public:
    int findMaximizedCapital(int k, int w, vector<int>& profits, vector<int>& capital) {
        int n = profits.size();
        vector<pair<int, int>> projects;
        
        for (int i = 0; i < n; i++) {
            projects.push_back({capital[i], profits[i]});
        }
        
        sort(projects.begin(), projects.end());
        
        priority_queue<int> available;
        int idx = 0;
        
        for (int i = 0; i < k; i++) {
            while (idx < n && projects[idx].first <= w) {
                available.push(projects[idx].second);
                idx++;
            }
            
            if (available.empty()) break;
            
            w += available.top();
            available.pop();
        }
        
        return w;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
        int n = profits.length;
        int[][] projects = new int[n][2];
        
        for (int i = 0; i < n; i++) {
            projects[i][0] = capital[i];
            projects[i][1] = profits[i];
        }
        
        Arrays.sort(projects, (a, b) -> a[0] - b[0]);
        
        PriorityQueue<Integer> available = new PriorityQueue<>(Collections.reverseOrder());
        int idx = 0;
        
        for (int i = 0; i < k; i++) {
            while (idx < n && projects[idx][0] <= w) {
                available.offer(projects[idx][1]);
                idx++;
            }
            
            if (available.isEmpty()) break;
            
            w += available.poll();
        }
        
        return w;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} k
 * @param {number} w
 * @param {number[]} profits
 * @param {number[]} capital
 * @return {number}
 */
function findMaximizedCapital(k, w, profits, capital) {
    const n = profits.length;
    const projects = [];
    
    for (let i = 0; i < n; i++) {
        projects.push([capital[i], profits[i]]);
    }
    
    projects.sort((a, b) => a[0] - b[0]);
    
    const available = [];
    let idx = 0;
    
    for (let i = 0; i < k; i++) {
        while (idx < n && projects[idx][0] <= w) {
            available.push(projects[idx][1]);
            available.sort((a, b) => b - a);
            idx++;
        }
        
        if (available.length === 0) break;
        
        w += available.shift();
    }
    
    return w;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - Sorting + heap operations |
| Space | O(n) - Projects and heap |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Sort + Heap | O(n log n) | O(n) | **Recommended** - General solution |
| Two Heaps | O(n log n) | O(n) | Dynamic min/max tracking |
| Multiset | O(n log n) | O(n) | When need to delete arbitrary elements |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Minimum Cost to Hire K Workers](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/) | 857 | Hard | Ratio-based selection |
| [IPO](https://leetcode.com/problems/ipo/) | 502 | Hard | Capital maximization |
| [Course Schedule III](https://leetcode.com/problems/course-schedule-iii/) | 630 | Hard | Deadline scheduling |
| [Maximum Performance of a Team](https://leetcode.com/problems/maximum-performance-of-a-team/) | 1383 | Hard | Speed/efficiency ratio |
| [Sell Diminishing-Valued Colored Balls](https://leetcode.com/problems/sell-diminishing-valued-colored-balls/) | 1648 | Medium | Priority based selling |

## Video Tutorial Links

1. **[NeetCode - Minimum Cost to Hire Workers](https://www.youtube.com/watch?v=3PPN1co5DPs)** - Greedy + heap
2. **[Kevin Naughton Jr. - IPO](https://www.youtube.com/watch?v=ry13dVZWGLI)** - Two-heap approach
3. **[Back To Back SWE - Greedy Heap](https://www.youtube.com/watch?v=ipVk2RbP7Dg)** - Pattern explanation

## Summary

### Key Takeaways

- **Greedy + heap**: Combine greedy choice with efficient selection
- **Max heap for minimum**: Track largest qualities to potentially remove
- **Sort by ratio**: Key insight for worker selection problem
- **Constraint enforcement**: Heap size enforces K constraint
- **Iterate and select**: Add candidates, then pick best

### Common Pitfalls

- Using wrong heap type (min vs max)
- Not sorting by the right criteria first
- Forgetting to update running sum when popping from heap
- Off-by-one in heap size check
- Not handling empty heap case

### Follow-up Questions

1. **Why sort by ratio first?**
   - Ensures fairness constraint is satisfied

2. **Can we solve without heap?**
   - Not efficiently; heap gives O(log K) selection

3. **What if we need exactly K workers?**
   - Algorithm naturally ensures this

4. **How to handle equal ratios?**
   - Any order works; quality will determine selection

## Pattern Source

[Heap - Scheduling / Minimum Cost (Greedy with Priority Queue)](patterns/heap-scheduling-minimum-cost-greedy-with-priority-queue.md)
