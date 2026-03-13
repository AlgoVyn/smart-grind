# Maximum Average Pass Ratio

## Problem Description

There is a school that has classes of students and each class will be having a final exam. You are given a 2D integer array `classes`, where `classes[i] = [passi, totali]`. You know beforehand that in the ith class, there are `totali` total students, but only `passi` number of students will pass the exam.

You are also given an integer `extraStudents`. There are another `extraStudents` brilliant students that are guaranteed to pass the exam of any class they are assigned to. You want to assign each of the `extraStudents` students to a class in a way that maximizes the average pass ratio across all the classes.

The pass ratio of a class is equal to the number of students of the class that will pass the exam divided by the total number of students of the class. The average pass ratio is the sum of pass ratios of all the classes divided by the number of the classes.

Return the maximum possible average pass ratio after assigning the `extraStudents` students. Answers within `10^-5` of the actual answer will be accepted.

**Link to problem:** [Maximum Average Pass Ratio - LeetCode 1792](https://leetcode.com/problems/maximum-average-pass-ratio/)

---

## Examples

### Example 1

**Input:**
```python
classes = [[1,2],[3,5],[2,2]], extraStudents = 2
```

**Output:**
```python
0.78333
```

**Explanation:** You can assign the two extra students to the first class. The average pass ratio will be equal to `(3/4 + 3/5 + 2/2) / 3 = 0.78333`.

### Example 2

**Input:**
```python
classes = [[2,4],[3,9],[4,5],[2,10]], extraStudents = 4
```

**Output:**
```python
0.53485
```

---

## Constraints

- `1 <= classes.length <= 10^5`
- `classes[i].length == 2`
- `1 <= passi <= totali <= 10^5`
- `1 <= extraStudents <= 10^5`

---

## Pattern: Greedy with Max-Heap (Priority Queue)

This problem uses the **Greedy Heap** pattern where we always assign extra students to the class that gains the most pass ratio. The key insight is that the gain from adding a student decreases as the pass ratio increases, so we use a max-heap to always pick the class with highest marginal gain.

### Core Concept

- **Marginal Gain**: The improvement in pass ratio when adding one student
- **Decreasing Returns**: Adding students to low ratio classes has higher marginal gain
- **Greedy Choice**: Always pick the class with maximum marginal gain

### When to Use This Pattern

This pattern is applicable when:
1. Maximizing average by distributing resources
2. Problems with diminishing returns
3. Allocation problems with greedy selection

---

## Intuition

The key insight for this problem is understanding how adding a student affects the pass ratio:

### Why Greedy Works

1. **Marginal Gain Formula**: When we add a student to a class with `p` passes and `t` total students:
   - Before: pass ratio = p/t
   - After: pass ratio = (p+1)/(t+1)
   - Gain = (p+1)/(t+1) - p/t = (t-p) / (t × (t+1))

2. **Diminishing Returns**: The gain is highest when:
   - `t` is small (class is small)
   - `p` is much less than `t` (pass ratio is low)

   This means adding a student to a class with low pass ratio helps more than adding to an already high-performing class.

3. **Greedy Selection**: By always picking the class with the highest marginal gain, we maximize the overall average. This works because:
   - Each decision is independent
   - The gain function is concave (diminishing returns)
   - We want to maximize sum of gains

### Why Not Brute Force?

With up to 10^5 extra students, we can't try all possible assignments. The greedy approach with a heap gives O((n + k) log n) time, which is efficient.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Greedy Max-Heap (Optimal)** - O((n + k) log n)
2. **Binary Search** - O(n × log(precision)) - Alternative approach

---

## Approach 1: Greedy Max-Heap (Optimal)

This is the most efficient and commonly used approach.

### Why It Works

The max-heap approach works because:
- We can quickly find the class that gains the most from adding a student
- The greedy choice of always picking maximum gain is optimal due to diminishing returns
- We can efficiently update the heap after each assignment

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def maxAverageRatio(self, classes: List[List[int]], extraStudents: int) -> float:
        """
        Maximize average pass ratio using greedy with max-heap.
        
        Args:
            classes: List of [pass, total] for each class
            extraStudents: Number of students to assign
            
        Returns:
            Maximum possible average pass ratio
        """
        def gain(p: int, t: int) -> float:
            """Calculate marginal gain from adding one student."""
            return (t - p) / (t * (t + 1))
        
        # Create max-heap (use negative for min-heap simulation)
        heap = []
        for p, t in classes:
            heapq.heappush(heap, (-gain(p, t), p, t))
        
        # Assign extra students
        for _ in range(extraStudents):
            _, p, t = heapq.heappop(heap)
            p += 1
            t += 1
            heapq.heappush(heap, (-gain(p, t), p, t))
        
        # Calculate final average
        total_ratio = 0
        for _, p, t in heap:
            total_ratio += p / t
        return total_ratio / len(classes)
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <cmath>
using namespace std;

class Solution {
public:
    double maxAverageRatio(vector<vector<int>>& classes, int extraStudents) {
        auto gain = [](double p, double t) {
            return (t - p) / (t * (t + 1));
        };
        
        // Max-heap using greater comparator
        priority_queue<pair<double, pair<int, int>>> pq;
        
        for (const auto& c : classes) {
            int p = c[0], t = c[1];
            pq.push({gain(p, t), {p, t}});
        }
        
        for (int i = 0; i < extraStudents; i++) {
            auto [g, pt] = pq.top();
            pq.pop();
            int p = pt.first, t = pt.second;
            p++;
            t++;
            pq.push({gain(p, t), {p, t}});
        }
        
        double total = 0;
        while (!pq.empty()) {
            auto [g, pt] = pq.top();
            pq.pop();
            total += (double)pt.first / pt.second;
        }
        
        return total / classes.size();
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public double maxAverageRatio(int[][] classes, int extraStudents) {
        // Custom comparator for max-heap based on gain
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> {
            double gainA = calculateGain(a[0], a[1]);
            double gainB = calculateGain(b[0], b[1]);
            return Double.compare(gainB, gainA);
        });
        
        // Add all classes to heap
        for (int[] c : classes) {
            pq.offer(c);
        }
        
        // Assign extra students
        for (int i = 0; i < extraStudents; i++) {
            int[] c = pq.poll();
            c[0]++;  // pass
            c[1]++;  // total
            pq.offer(c);
        }
        
        // Calculate final average
        double total = 0;
        for (int[] c : pq) {
            total += (double) c[0] / c[1];
        }
        
        return total / classes.length;
    }
    
    private double calculateGain(int p, int t) {
        return (double) (t - p) / (t * (t + 1));
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} classes
 * @param {number} extraStudents
 * @return {number}
 */
var maxAverageRatio = function(classes, extraStudents) {
    const gain = (p, t) => (t - p) / (t * (t + 1));
    
    // Max-heap using sort
    const heap = classes.map(c => ({p: c[0], t: c[1], gain: gain(c[0], c[1])}))
                       .sort((a, b) => b.gain - a.gain);
    
    for (let i = 0; i < extraStudents; i++) {
        const top = heap.shift();
        top.p++;
        top.t++;
        top.gain = gain(top.p, top.t);
        
        // Re-insert in sorted position
        let j = 0;
        while (j < heap.length && heap[j].gain > top.gain) j++;
        heap.splice(j, 0, top);
    }
    
    let total = 0;
    for (const c of heap) {
        total += c.p / c.t;
    }
    
    return total / classes.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O((n + k) log n) where n = classes, k = extraStudents |
| **Space** | O(n) for the heap |

---

## Approach 2: Binary Search

### Algorithm Steps

1. Set search range for the answer (0 to 1)
2. For each mid value, check if we can achieve at least that average
3. Use greedy to simulate adding students and check ratio
4. Binary search until precision is achieved

### Why It Works

Binary search can find the optimal average because the problem is monotonic - if we can achieve average X, we can achieve any average less than X.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxAverageRatio_binary(self, classes: List[List[int]], extraStudents: int) -> float:
        """
        Binary search approach to find maximum average.
        """
        def canAchieve(target: float) -> bool:
            """Check if we can achieve at least target average."""
            needed = 0
            for p, t in classes:
                # Students needed to reach target for this class
                # p/t >= target => p >= target * t
                # We need p' = p + x, t' = t + x such that p'/t' >= target
                # x >= (target * t - p) / (1 - target)
                if p / t >= target:
                    continue
                x = (target * t - p) / (1 - target)
                needed += math.ceil(x)
            return needed <= extraStudents
        
        # Binary search
        lo, hi = 0.0, 1.0
        for _ in range(40):  # Precision iterations
            mid = (lo + hi) / 2
            if canAchieve(mid):
                lo = mid
            else:
                hi = mid
        
        return lo
```

<!-- slide -->
```cpp
#include <vector>
#include <cmath>
using namespace std;

class Solution {
public:
    double maxAverageRatio(vector<vector<int>>& classes, int extraStudents) {
        auto canAchieve = [&](double target) {
            double needed = 0;
            for (const auto& c : classes) {
                double p = c[0], t = c[1];
                if (p / t >= target) continue;
                needed += ceil((target * t - p) / (1 - target));
            }
            return needed <= extraStudents;
        };
        
        double lo = 0, hi = 1;
        for (int i = 0; i < 40; i++) {
            double mid = (lo + hi) / 2;
            if (canAchieve(mid)) lo = mid;
            else hi = mid;
        }
        
        return lo;
    }
};
```

<!-- slide -->
```java
class Solution {
    public double maxAverageRatioBinary(int[][] classes, int extraStudents) {
        // Binary search implementation
        double lo = 0, hi = 1;
        for (int i = 0; i < 40; i++) {
            double mid = (lo + hi) / 2;
            if (canAchieve(classes, extraStudents, mid)) {
                lo = mid;
            } else {
                hi = mid;
            }
        }
        return lo;
    }
    
    private boolean canAchieve(int[][] classes, int extraStudents, double target) {
        double needed = 0;
        for (int[] c : classes) {
            double p = c[0], t = c[1];
            if (p / t >= target) continue;
            needed += Math.ceil((target * t - p) / (1 - target));
        }
        return needed <= extraStudents;
    }
}
```

<!-- slide -->
```javascript
var maxAverageRatioBinary = function(classes, extraStudents) {
    const canAchieve = (target) => {
        let needed = 0;
        for (const [p, t] of classes) {
            if (p / t >= target) continue;
            needed += Math.ceil((target * t - p) / (1 - target));
        }
        return needed <= extraStudents;
    };
    
    let lo = 0, hi = 1;
    for (let i = 0; i < 40; i++) {
        const mid = (lo + hi) / 2;
        if (canAchieve(mid)) lo = mid;
        else hi = mid;
    }
    
    return lo;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × log(precision)) |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Greedy Heap | Binary Search |
|--------|-------------|---------------|
| **Time Complexity** | O((n+k) log n) | O(n × log(precision)) |
| **Space Complexity** | O(n) | O(1) |
| **Implementation** | Moderate | Complex |
| **Best For** | Most cases | When k is very large |

**Best Approach:** Use Approach 1 (Greedy Max-Heap) for most cases as it's simpler and efficient.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Google
- **Difficulty**: Medium
- **Concepts Tested**: Greedy algorithms, Heap/Priority Queue, Optimization

### Learning Outcomes

1. **Heap Mastery**: Learn to use heap for greedy selection
2. **Mathematical Insight**: Understand marginal gain calculations
3. **Optimization**: Learn greedy works due to diminishing returns

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Maximum Average Pass Ratio | [Link](https://leetcode.com/problems/maximum-average-pass-ratio/) | This problem |
| K Closest Points to Origin | [Link](https://leetcode.com/problems/k-closest-points-to-origin/) | Heap-based |
| Top K Frequent Elements | [Link](https://leetcode.com/problems/top-k-frequent-elements/) | Heap-based |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Maximum Average Pass Ratio](https://www.youtube.com/watch?v=5Linky5D3-GU)** - Clear explanation with examples
2. **[Greedy with Heap](https://www.youtube.com/watch?v=6xLSN1F1C88)** - Understanding heap-based greedy
3. **[Binary Search on Answer](https://www.youtube.com/watch?v=7X8sD6y8zWw)** - Alternative approach

---

## Follow-up Questions

### Q1: What is the time complexity?

**Answer:** O((n + k) log n) where n is the number of classes and k is extraStudents.

---

### Q2: Why does the greedy approach work?

**Answer:** The gain function is concave (diminishing returns), meaning adding a student to a lower-performing class has higher marginal gain. The greedy choice of always picking maximum gain is optimal.

---

### Q3: What if we wanted to minimize the average instead?

**Answer:** You would reverse the gain formula to prioritize classes with higher pass ratios (which have lower marginal gain).

---

### Q4: How would you handle ties in the heap?

**Answer:** Ties don't matter - any class with maximum gain produces the same result. The heap handles ties correctly.

---

### Q5: What edge cases should be tested?

**Answer:**
- All classes have 100% pass ratio
- All classes have very low pass ratio
- Large number of extra students
- Single class

---

## Common Pitfalls

### 1. Wrong Gain Formula
**Issue**: Using incorrect formula for marginal gain.

**Solution**: The gain is `(t - p) / (t * (t + 1))`. Derive from: `(p+1)/(t+1) - p/t`.

### 2. Sign in Heap
**Issue**: Python's heapq is a min-heap, forgetting to negate values.

**Solution**: Use negative gain: `heapq.heappush(heap, (-gain(p, t), p, t))`.

### 3. Precision Issues
**Issue**: Using integer division instead of float.

**Solution**: Use `/` for float division, not `//`.

### 4. Not Recalculating Gain
**Issue**: Forgetting to recalculate gain after adding a student.

**Solution**: After each assignment, recalculate and update the heap entry.

---

## Summary

The **Maximum Average Pass Ratio** problem demonstrates the **Greedy Heap** pattern:

- **Greedy with Heap**: Always assign to class with highest marginal gain
- **Diminishing Returns**: Lower-performing classes benefit more
- **Optimal**: Greedy works due to concave gain function

Key takeaways:
1. Calculate marginal gain correctly: (t-p) / (t*(t+1))
2. Use max-heap to always pick highest gain class
3. Recalculate gain after each assignment
4. Time complexity: O((n+k) log n)

This problem is excellent for learning greedy optimization with heaps and is frequently asked in technical interviews.

---

## Additional Resources

- [LeetCode Problem 1792](https://leetcode.com/problems/maximum-average-pass-ratio/) - Official problem page
- [Heap Data Structure](https://en.wikipedia.org/wiki/Heap_(data_structure)) - Heap fundamentals
- [Greedy Algorithms](https://en.wikipedia.org/wiki/Greedy_algorithm) - Greedy algorithm theory
