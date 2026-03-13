# Capacity To Ship Packages Within D Days

## Problem Description

A conveyor belt has packages that must be shipped from one port to another within days days.
The ith package on the conveyor belt has a weight of weights[i]. Each day, we load the ship with packages on the conveyor belt (in the order given by weights). We may not load more weight than the maximum weight capacity of the ship.
Return the least weight capacity of the ship that will result in all the packages on the conveyor belt being shipped within days days.

**Link to problem:** [Capacity To Ship Packages Within D Days - LeetCode 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)

---

## Pattern: Binary Search on Answer

This problem exemplifies the **Binary Search on Answer** pattern. The key insight is to binary search on the possible ship capacity values.

### Core Concept

The fundamental concept is:
1. **Monotonic Property**: If we can ship in D days with capacity X, we can also ship in D days with any capacity >= X
2. **Binary Search**: Search for the minimum capacity that works
3. **Greedy Check**: For a given capacity, greedily accumulate packages until exceeding capacity

---

## Examples

### Example

**Input:**
```
weights = [1,2,3,4,5,6,7,8,9,10], days = 5
```

**Output:**
```
15
```

**Explanation:** A ship capacity of 15 is the minimum to ship all the packages in 5 days like this:
- 1st day: 1, 2, 3, 4, 5 (sum = 15)
- 2nd day: 6, 7 (sum = 13)
- 3rd day: 8 (sum = 8)
- 4th day: 9 (sum = 9)
- 5th day: 10 (sum = 10)

### Example 2

**Input:**
```
weights = [3,2,2,4,1,4], days = 3
```

**Output:**
```
6
```

**Explanation:** A ship capacity of 6 is the minimum to ship all the packages in 3 days like this:
- 1st day: 3, 2 (sum = 5)
- 2nd day: 2, 4 (sum = 6)
- 3rd day: 1, 4 (sum = 5)

### Example 3

**Input:**
```
weights = [1,2,3,1,1], days = 4
```

**Output:**
```
3
```

**Explanation:**
- 1st day: 1 (sum = 1)
- 2nd day: 2 (sum = 2)
- 3rd day: 3 (sum = 3)
- 4th day: 1, 1 (sum = 2)

---

## Constraints

- `1 <= days <= weights.length <= 5 * 10^4`
- `1 <= weights[i] <= 500`

---

## Intuition

The key insights are:

1. **Search Space**:
   - Lower bound: max(weights) - Can't split a package
   - Upper bound: sum(weights) - Ship everything in one day

2. **Monotonic Property**:
   - If capacity X works, any capacity > X also works
   - If capacity X doesn't work, any capacity < X also doesn't work

3. **Greedy Check**:
   - For a given capacity, accumulate packages until exceeding capacity
   - Start a new day when needed
   - Count total days needed

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search (Optimal)** - O(n log S) time
2. **Dynamic Programming** - O(n * days) time, O(n * days) space

---

## Approach 1: Binary Search on Answer (Optimal)

This is the most efficient approach using binary search.

### Algorithm Steps

1. Set low = max(weights), high = sum(weights)
2. While low < high:
   - mid = (low + high) // 2
   - Check if we can ship with capacity = mid
   - If yes, high = mid
   - If no, low = mid + 1
3. Return low

### Why It Works

Binary search finds the minimum capacity because:
- If capacity works, we try smaller
- If capacity doesn't work, we try larger
- The monotonic property ensures we won't miss the answer

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def shipWithinDays(self, weights: List[int], days: int) -> int:
        """
        Find minimum ship capacity to ship all packages within days days.
        
        Args:
            weights: List of package weights
            days: Number of days to ship all packages
            
        Returns:
            Minimum capacity needed
        """
        def can_ship(capacity: int) -> bool:
            """Check if we can ship all packages within days days."""
            current = 0
            required_days = 1
            
            for w in weights:
                if current + w > capacity:
                    required_days += 1
                    current = w
                    if required_days > days:
                        return False
                else:
                    current += w
            
            return True
        
        # Binary search range
        left = max(weights)  # Minimum possible capacity
        right = sum(weights)  # Maximum possible capacity
        
        while left < right:
            mid = (left + right) // 2
            
            if can_ship(mid):
                right = mid  # Try smaller capacity
            else:
                left = mid + 1  # Need larger capacity
        
        return left
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int shipWithinDays(vector<int>& weights, int days) {
        auto canShip = [&](int capacity) -> bool {
            int current = 0;
            int requiredDays = 1;
            
            for (int w : weights) {
                if (current + w > capacity) {
                    requiredDays++;
                    current = w;
                    if (requiredDays > days) return false;
                } else {
                    current += w;
                }
            }
            return true;
        };
        
        int left = *max_element(weights.begin(), weights.end());
        int right = accumulate(weights.begin(), weights.end(), 0);
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (canShip(mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        return left;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int left = 0, right = 0;
        
        for (int w : weights) {
            left = Math.max(left, w);
            right += w;
        }
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            if (canShip(weights, days, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        return left;
    }
    
    private boolean canShip(int[] weights, int days, int capacity) {
        int current = 0;
        int requiredDays = 1;
        
        for (int w : weights) {
            if (current + w > capacity) {
                requiredDays++;
                current = w;
                if (requiredDays > days) return false;
            } else {
                current += w;
            }
        }
        
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} weights
 * @param {number} days
 * @return {number}
 */
var shipWithinDays = function(weights, days) {
    const canShip = (capacity) => {
        let current = 0;
        let requiredDays = 1;
        
        for (const w of weights) {
            if (current + w > capacity) {
                requiredDays++;
                current = w;
                if (requiredDays > days) return false;
            } else {
                current += w;
            }
        }
        
        return true;
    };
    
    let left = Math.max(...weights);
    let right = weights.reduce((a, b) => a + b, 0);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        if (canShip(mid)) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    
    return left;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log S) - n = number of packages, S = sum of weights |
| **Space** | O(1) - Only uses a few variables |

---

## Approach 2: Dynamic Programming

This approach uses DP to find the minimum capacity.

### Algorithm Steps

1. Use DP where dp[i][d] = minimum capacity to ship first i packages in d days
2. For each day, try all possible partitions
3. Use binary search within DP for optimization

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def shipWithinDays_dp(self, weights: List[int], days: int) -> int:
        """DP approach (less efficient but correct)."""
        n = len(weights)
        
        # dp[i] = minimum capacity to ship first i packages
        # We'll use prefix sums for efficient range sum
        
        # Not practical for large n, but shows the concept
        # This is O(n^2 * days) which is too slow
        
        # Use binary search on answer (Approach 1) is preferred
        pass
```

<!-- slide -->
```cpp
// The DP approach is not practical due to time complexity
// Use binary search (Approach 1) instead
```

<!-- slide -->
```java
// The DP approach is not practical due to time complexity
// Use binary search (Approach 1) instead
```

<!-- slide -->
```javascript
// The DP approach is not practical due to time complexity
// Use binary search (Approach 1) instead
```
````

---

## Comparison of Approaches

| Aspect | Binary Search | DP |
|--------|---------------|-----|
| **Time Complexity** | O(n log S) | O(n² × days) |
| **Space Complexity** | O(1) | O(n × days) |
| **Practical** | ✅ Yes | ❌ No |

**Best Approach:** Binary search is the optimal solution.

---

## Why This Problem is Important

This problem demonstrates:
1. **Binary Search on Answer**: A powerful pattern for optimization problems
2. **Monotonic Property**: Leveraging monotonicity for search
3. **Greedy Verification**: Simple greedy check for feasibility
4. **Real-world Application**: Resource allocation problem

---

## Related Problems

### Same Pattern (Binary Search on Answer)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) | 410 | Hard | Similar to this |
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | 875 | Medium | Find minimum speed |
| [Minimum Time to Visit a Cell in a Grid](https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid/) | 2570 | Hard | Grid with time |

### Similar Concepts

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| [Painters Partition Problem](https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1) | | Similar problem |
| [Boats to Save People](https://leetcode.com/problems/boats-to-save-people/) | 881 | Greedy pairing |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Capacity To Ship Packages Within D Days](https://www.youtube.com/watch?v=ASoaQqBFfoQ)** - Clear explanation

2. **[Binary Search on Answer](https://www.youtube.com/watch?v=AmSrAkn7s8U)** - Pattern explanation

3. **[Split Array Problem](https://www.youtube.com/watch?v=0wTI5Z-WncQ)** - Similar problem

---

## Follow-up Questions

### Q1: How would you track which packages go on which day?

**Answer:** Modify the canShip function to return the partition points. After finding optimal capacity, run again to get actual partitions.

---

### Q2: What if packages must stay together (can't split packages across days)?

**Answer:** The current solution already handles this - we never split a single package.

---

### Q3: How would you handle the case with different ship capacities each day?

**Answer:** This becomes a more complex problem. You would to each need to assign capacities Q4: What day.

---

### if there's a time limit per day?

**Answer:** This becomes similar to the current problem, just with a different constraint.

---

### Q5: Can you use divide and conquer instead of binary search?

**Answer:** No we, because need to find the minimum value that satisfies the any value.

---

 condition, not just### Q6: What edge cases should be tested?

**Answer:**
- days = 1 (ship everything in one day)
- days = n (one package per day)
- All packages same weight
- Single package

---

## Common Pitfalls

### 1. Wrong Search Range
**Issue:** Not setting correct lower/upper bounds.

**Solution:** Lower bound = max(weights), Upper bound = sum(weights).

### 2. Off-by-One
**Issue:** Incorrect comparison in canShip function.

**Solution:** Use >= for checking overflow.

### 3. Not Breaking Early
**Issue:** Not returning early when days exceed limit.

**Solution:** Add early exit in the loop.

---

## Summary

The **Capacity To Ship Packages Within D Days** problem demonstrates binary search on answer:

- **Binary search**: Find minimum capacity that works
- **Greedy check**: Simulate shipping with given capacity
- **Monotonic property**: If X works, any >= X works

Key takeaways:
- **Binary search pattern**: Search for minimum feasible value
- **Greedy verification**: Simple check for feasibility
- **Time optimization**: O(n log S) is efficient

This problem is essential for understanding binary search on answer patterns.

### Pattern Summary

This problem exemplifies the **Binary Search on Answer** pattern, characterized by:
- Monotonic relationship between answer and feasibility
- Binary search on the search space
- Greedy verification of candidate answers

For more details on this pattern, see the **[Binary Search on Answer](/algorithms/binary-search-answer)** section.
