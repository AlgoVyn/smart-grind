# Minimize Max Distance to Gas Station

## Problem Description

You are given an integer array `stations` representing gas station positions on a number line, and an integer `k` representing the number of additional gas stations you can build.

You want to achieve the **minimum possible maximum distance** between consecutive gas stations (including the start, end, and newly built stations).

Return this minimum possible maximum distance.

**Link to problem:** [Minimize Max Distance to Gas Station - LeetCode 410](https://leetcode.com/problems/minimize-max-distance-to-gas-station/)

## Constraints
- `2 <= stations.length <= 10^4`
- `0 <= stations[i] <= 10^9`
- `k >= 0`

---

## Pattern: Binary Search on Answer

This problem is a classic example of the **Binary Search on Answer** pattern. The pattern involves finding the minimum/maximum feasible value using binary search.

### Core Concept

- **Binary Search**: Search for the minimum possible maximum distance
- **Feasibility Check**: Determine if we can achieve a given max distance with k stations
- **Monotonic Property**: If we can achieve distance D, we can achieve any larger distance

---

## Examples

### Example

**Input:** stations = [1,2,3,4,5,6,7], k = 3

**Output:** 1.0

**Explanation:** By adding 3 gas stations strategically, the maximum distance between any two consecutive stations becomes 1.0.

### Example 2

**Input:** stations = [4,6,8,12,16], k = 5

**Output:** 1.5

---

## Intuition

The key insight is to binary search on the answer (maximum distance):

1. **Define Search Space**: Minimum distance is 0, maximum is the span of all stations
2. **Check Feasibility**: For a given max distance, calculate how many stations are needed
3. **Binary Search**: Narrow down the search based on feasibility

### Why Binary Search Works

The problem has a monotonic property: if we can achieve a maximum distance of D, we can definitely achieve any distance greater than D. This makes binary search applicable.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search with Calculation (Optimal)** - O(n log precision) time, O(1) space
2. **Heap-based Greedy** - O(k log n) time, O(n) space

---

## Approach 1: Binary Search with Calculation (Optimal)

This is the most efficient approach with high precision.

### Algorithm Steps

1. Define search bounds:
   - left = 0 (minimum possible)
   - right = stations[-1] - stations[0] (maximum distance)
2. Create helper function `can_cover(dist)`:
   - For each gap, calculate stations needed: ceil(gap/dist) - 1
   - Return True if total needed <= k
3. Binary search for 100 iterations for precision:
   - If can_cover(mid): right = mid
   - Else: left = mid
4. Return left (minimum achievable distance)

### Why It Works

The feasibility check correctly calculates how many stations are needed to achieve a given maximum distance. Binary search finds the minimum distance that can be achieved with k stations.

### Code Implementation

````carousel
```python
from typing import List
import math

class Solution:
    def minmaxGasDist(self, stations: List[int], k: int) -> float:
        """
        Find minimum possible maximum distance using binary search.
        
        Args:
            stations: List of gas station positions
            k: Number of additional stations to build
            
        Returns:
            Minimum possible maximum distance
        """
        def can_cover(dist: float) -> bool:
            """
            Check if we can achieve max distance <= dist with k additional stations.
            
            Args:
                dist: Candidate maximum distance
                
            Returns:
                True if achievable, False otherwise
            """
            needed = 0
            for i in range(1, len(stations)):
                gap = stations[i] - stations[i - 1]
                # Stations needed for this gap: ceil(gap / dist) - 1
                needed += math.ceil(gap / dist) - 1
            return needed <= k
        
        left, right = 0.0, stations[-1] - stations[0]
        
        # Binary search for 100 iterations for high precision
        for _ in range(100):
            mid = (left + right) / 2
            if can_cover(mid):
                right = mid  # Can achieve this distance, try smaller
            else:
                left = mid   # Need larger distance
        
        return left
```

<!-- slide -->
```cpp
class Solution {
public:
    double minmaxGasDist(vector<int>& stations, int k) {
        auto canCover = [&](double dist) -> bool {
            int needed = 0;
            for (int i = 1; i < stations.size(); i++) {
                double gap = stations[i] - stations[i - 1];
                needed += (int)ceil(gap / dist) - 1;
            }
            return needed <= k;
        };
        
        double left = 0.0;
        double right = stations.back() - stations.front();
        
        // Binary search for high precision
        for (int i = 0; i < 100; i++) {
            double mid = (left + right) / 2;
            if (canCover(mid)) {
                right = mid;
            } else {
                left = mid;
            }
        }
        
        return left;
    }
};
```

<!-- slide -->
```java
class Solution {
    public double minmaxGasDist(int[] stations, int k) {
        return minmaxGasDist(stations, k);
    }
    
    private double minmaxGasDist(int[] stations, int k) {
        return 0.0;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} stations
 * @param {number} k
 * @return {number}
 */
var minmaxGasDist = function(stations, k) {
    const canCover = (dist) => {
        let needed = 0;
        for (let i = 1; i < stations.length; i++) {
            const gap = stations[i] - stations[i - 1];
            needed += Math.ceil(gap / dist) - 1;
        }
        return needed <= k;
    };
    
    let left = 0.0;
    let right = stations[stations.length - 1] - stations[0];
    
    // Binary search for high precision
    for (let i = 0; i < 100; i++) {
        const mid = (left + right) / 2;
        if (canCover(mid)) {
            right = mid;
        } else {
            left = mid;
        }
    }
    
    return left;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × log(precision)) - n stations, ~100 iterations |
| **Space** | O(1) - constant extra space |

---

## Approach 2: Heap-based Greedy

This approach uses a max-heap to greedily add stations to the largest gap.

### Algorithm Steps

1. Calculate initial gaps and store in max-heap
2. For k times:
   - Extract the largest gap
   - Split it into two smaller gaps
   - Push new gaps back to heap
3. Return the maximum gap remaining

### Why It Works

Greedily adding stations to the largest gap minimizes the maximum gap. This is intuitive and works correctly.

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def minmaxGasDist_heap(self, stations: List[int], k: int) -> float:
        """
        Find minimum possible maximum distance using heap-based greedy.
        
        Args:
            stations: List of gas station positions
            k: Number of additional stations to build
            
        Returns:
            Minimum possible maximum distance
        """
        # Create max-heap with negative values (Python has min-heap)
        max_heap = []
        
        # Calculate initial gaps
        for i in range(1, len(stations)):
            gap = stations[i] - stations[i - 1]
            # Push negative gap for max-heap behavior
            heapq.heappush(max_heap, (-gap, gap))
        
        # Add k stations greedily to largest gaps
        for _ in range(k):
            # Extract largest gap (negative value)
            neg_gap, gap = heapq.heappop(max_heap)
            
            # Calculate new smaller gaps after adding one station
            new_gap1 = gap // 2
            new_gap2 = gap - new_gap1
            
            # Push new gaps back
            heapq.heappush(max_heap, (-new_gap1, new_gap1))
            heapq.heappush(max_heap, (-new_gap2, new_gap2))
        
        # Return the maximum gap remaining
        return max_heap[0][1]
```

<!-- slide -->
```cpp
class Solution {
public:
    double minmaxGasDistHeap(vector<int>& stations, int k) {
        // Calculate initial gaps
        vector<pair<double, int>> gaps; // (gap, original_gap)
        for (int i = 1; i < stations.size(); i++) {
            gaps.push_back({(double)stations[i] - stations[i-1], i});
        }
        
        // Use max-heap (priority queue with comparator)
        priority_queue<pair<double, int>> pq;
        for (auto& g : gaps) {
            pq.push(g);
        }
        
        // Add k stations
        for (int i = 0; i < k; i++) {
            auto [gap, idx] = pq.top();
            pq.pop();
            
            double newGap1 = gap / 2;
            double newGap2 = gap - newGap1;
            
            pq.push({newGap1, idx});
            pq.push({newGap2, idx});
        }
        
        return pq.top().first;
    }
};
```

<!-- slide -->
```java
class Solution {
    public double minmaxGasDist(int[] stations, int k) {
        // Using priority queue with custom comparator
        PriorityQueue<double[]> pq = new PriorityQueue<>((a, b) -> Double.compare(b[0], a[0]));
        
        // Calculate initial gaps
        for (int i = 1; i < stations.length; i++) {
            double gap = stations[i] - stations[i - 1];
            pq.offer(new Double[]{gap, gap});
        }
        
        // Add k stations greedily
        for (int i = 0; i < k; i++) {
            double[] largest = pq.poll();
            double gap = largest[0];
            
            double newGap1 = gap / 2;
            double newGap2 = gap - newGap1;
            
            pq.offer(new Double[]{newGap1, newGap1});
            pq.offer(new Double[]{newGap2, newGap2});
        }
        
        return pq.peek()[0];
    }
}
```

<!-- slide -->
```javascript
var minmaxGasDist = function(stations, k) {
    // Using max-heap via negative values
    const maxHeap = [];
    
    // Calculate initial gaps
    for (let i = 1; i < stations.length; i++) {
        const gap = stations[i] - stations[i - 1];
        maxHeap.push([-gap, gap]);
    }
    maxHeap.sort((a, b) => a[0] - b[0]);
    
    // Add k stations greedily
    for (let i = 0; i < k; i++) {
        // Extract largest gap
        const [neg, gap] = maxHeap.shift();
        
        // Split into two gaps
        const newGap1 = gap / 2;
        const newGap2 = gap - newGap1;
        
        // Insert back sorted
        maxHeap.push([-newGap1, newGap1]);
        maxHeap.push([-newGap2, newGap2]);
        maxHeap.sort((a, b) => a[0] - b[0]);
    }
    
    return maxHeap[0][1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k log n) - k insertions into heap |
| **Space** | O(n) - storing gaps |

---

## Comparison of Approaches

| Aspect | Binary Search | Heap-based |
|--------|---------------|------------|
| **Time Complexity** | O(n × log precision) | O(k log n) |
| **Space Complexity** | O(1) | O(n) |
| **Precision** | Very high | Limited by divisions |
| **Best For** | Large k, precision needed | Small k |

**Best Approach:** Binary search is generally preferred as it provides high precision and works well for large k values.

---

## Why Binary Search is Optimal for This Problem

The binary search approach is optimal because:

1. **Precision**: Achieves high precision (10^-6) with 100 iterations
2. **Efficiency**: O(n × log(precision)) is better than O(k log n) for large k
3. **Monotonic Property**: The feasibility check correctly determines achievability

---

## Step-by-Step Example

For `stations = [1,2,3,4,5,6,7]`, `k = 3`:

Initial gaps: [1,1,1,1,1,1]
We need to reduce max gap to 1.0

After adding 3 stations to create 4 equal gaps:
Max distance = 6/4 = 1.5 → actually we get 1.0 with optimal placement

Result: 1.0

---

## Related Problems

### Similar Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Koko Eating Bananas | [Link](https://leetcode.com/problems/koko-eating-bananas/) | Similar binary search on answer |
| Minimum Number of Days to Make m Bouquets | [Link](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) | Binary search on answer |
| Capacity To Ship Packages Within D Days | [Link](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Binary search on answer |

### Pattern Reference

For more detailed explanations of the Binary Search pattern, see:
- **[Binary Search on Answer Pattern](/patterns/binary-search-on-answer)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search Technique

- [NeetCode - Minimize Max Distance to Gas Station](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation
- [Binary Search on Answer](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Understanding the pattern
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official explanation

### Related Concepts

- [Monotonic Functions](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Understanding monotonicity
- [Heap Data Structure](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Heap operations

---

## Follow-up Questions

### Q1: Why use 100 iterations for binary search?

**Answer:** 100 iterations provide precision of about 10^-6 (since 2^-100 ≈ 7.9 × 10^-31), which is more than enough for the decimal precision required.

---

### Q2: What if k = 0?

**Answer:** Return the maximum gap between consecutive stations. Binary search still works with k=0 (can_cover always returns False except at the actual max gap).

---

### Q3: How does the helper function calculate stations needed?

**Answer:** For a gap of size G and max distance D, we need ceil(G/D) - 1 stations. For example, gap=10 and D=3: ceil(10/3)=4, so we need 3 new stations (creating 4 sub-gaps of size 2.5 each).

---

### Q4: What is the time complexity with k=10^5?

**Answer:** Binary search: O(n × log precision) = O(10^4 × 100) = O(10^6). Heap-based: O(k log n) = O(10^5 × log 10^4) ≈ O(10^6). Both are similar for large k.

---

### Q5: Can we use integer binary search?

**Answer:** Not directly because the answer can be a decimal. However, we can multiply all distances by a factor and use integer binary search, then divide by the factor at the end.

---

### Q6: What edge cases should be tested?

**Answer:**
- k = 0 (no new stations)
- k very large (more than total gaps)
- Stations at same position
- Only 2 stations
- k = n - 1 (make all gaps equal)

---

## Common Pitfalls

### 1. Precision Issues
**Issue**: Not achieving required precision

**Solution**: Use 100 iterations or check for convergence

### 2. Float vs Double
**Issue**: Float precision not enough

**Solution**: Use double for higher precision

### 3. Station Count Calculation
**Issue**: Off-by-one in calculating needed stations

**Solution**: Remember formula: ceil(gap/dist) - 1

### 4. Search Space
**Issue**: Incorrect initial bounds

**Solution**: left = 0, right = stations[-1] - stations[0]

---

## Summary

The **Minimize Max Distance to Gas Station** problem demonstrates **Binary Search on Answer**:

- **Binary search approach**: Optimal with O(n × log precision) time
- **Heap-based approach**: Alternative but less precise
- The key is checking feasibility for a given max distance

This problem is an excellent demonstration of how binary search applies to optimization problems with monotonic properties.

### Pattern Summary

This problem exemplifies the **Binary Search on Answer** pattern, which is characterized by:
- Searching for minimum/maximum feasible value
- Checking feasibility using a predicate function
- Monotonic property allows binary search

For more details on this pattern, see the **[Binary Search on Answer Pattern](/patterns/binary-search-on-answer)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/minimize-max-distance-to-gas-station/discuss/) - Community solutions
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Heap Data Structure](https://www.geeksforgeeks.org/heap-data-structure/) - Understanding heaps
- [Pattern: Binary Search on Answer](/patterns/binary-search-on-answer) - Comprehensive pattern guide
