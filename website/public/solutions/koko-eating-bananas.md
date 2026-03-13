# Koko Eating Bananas

## Problem Description

Koko loves to eat bananas. There are `n` piles of bananas, and the `i`-th pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.

Koko can decide her bananas-per-hour eating speed `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.

Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.

**Link to problem:** [Koko Eating Bananas - LeetCode 875](https://leetcode.com/problems/koko-eating-bananas/)

---

## Pattern: Binary Search - Monotonic Function

This problem demonstrates applying binary search on a monotonic function where the feasibility of a solution can be determined based on a predicate.

### Core Concept

The key insight is that the relationship between eating speed and hours needed is **monotonic**:
- Higher speed → Fewer hours needed (or same)
- Lower speed → More hours needed (or same)

This monotonicity allows us to use binary search to find the minimum speed that allows Koko to finish within `h` hours.

---

## Examples

### Example

**Input:**
```
piles = [3,6,7,11], h = 8
```

**Output:**
```
4
```

**Explanation:** At speed 4:
- Pile 1: 3/4 = 1 hour
- Pile 2: 6/4 = 2 hours
- Pile 3: 7/4 = 2 hours
- Pile 4: 11/4 = 3 hours
- Total: 1 + 2 + 2 + 3 = 8 hours

### Example 2

**Input:**
```
piles = [30,11,23,4,20], h = 5
```

**Output:**
```
30
```

**Explanation:** The only way to finish in 5 hours is to eat at maximum speed (30 bananas/hour).

### Example 3

**Input:**
```
piles = [30,11,23,4,20], h = 6
```

**Output:**
```
23
```

**Explanation:** At speed 23:
- 30/23 = 2 hours
- 11/23 = 1 hour
- 23/23 = 1 hour
- 4/23 = 1 hour
- 20/23 = 1 hour
- Total: 2 + 1 + 1 + 1 + 1 = 6 hours

---

## Constraints

- `1 <= piles.length <= 10^4`
- `piles.length <= h <= 10^9`
- `1 <= piles[i] <= 10^9`

---

## Intuition

The problem requires finding the minimum eating speed `k` such that Koko can finish all bananas within `h` hours. This is a classic binary search optimization problem:

1. **Binary Search Range**:
   - Lower bound: 1 (minimum possible speed)
   - Upper bound: max(piles) (maximum pile size, sufficient speed)

2. **Feasibility Check**:
   - For a given speed `k`, calculate hours needed = sum(ceil(p/k) for each pile)
   - If hours_needed <= h, the speed `k` is feasible
   - If hours_needed > h, the speed `k` is too slow

3. **Binary Search**:
   - Find the minimum speed where hours_needed <= h

The key insight is the **monotonicity**: if speed `k` works, any speed > k will also work.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search (Optimal)** - O(n log M) time, O(1) space
2. **Linear Search (Brute Force)** - O(n * M) time, O(1) space

---

## Approach 1: Binary Search (Optimal)

This is the optimal approach that uses binary search on the eating speed.

### Algorithm Steps

1. Set `left = 1` and `right = max(piles)` as search bounds
2. While `left < right`:
   - Calculate `mid = (left + right) // 2`
   - Calculate `hours_needed = sum(ceil(p / mid) for p in piles)`
   - If `hours_needed <= h`, speed is sufficient: `right = mid`
   - Otherwise, speed is too slow: `left = mid + 1`
3. Return `left` (minimum sufficient speed)

### Why It Works

The binary search works because:
- The predicate "can finish in h hours" is monotonic with respect to speed
- If speed `k` works, all speeds > k also work
- If speed `k` doesn't work, all speeds < k won't work either
- Binary search finds the minimum speed that satisfies the predicate

### Code Implementation

````carousel
```python
import math
from typing import List

class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        """
        Find minimum eating speed using binary search.
        
        Args:
            piles: List of banana piles
            h: Hours until guards return
            
        Returns:
            Minimum eating speed to finish in time
        """
        left, right = 1, max(piles)
        
        while left < right:
            mid = (left + right) // 2
            # Calculate hours needed at this speed
            hours_needed = sum(math.ceil(p / mid) for p in piles)
            
            if hours_needed <= h:
                # This speed is sufficient, try slower
                right = mid
            else:
                # Speed too slow, need faster
                left = mid + 1
        
        return left
```

<!-- slide -->
```cpp
class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        /**
         * Find minimum eating speed using binary search.
         */
        int left = 1;
        int right = *max_element(piles.begin(), piles.end());
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // Calculate hours needed at this speed
            long long hours_needed = 0;
            for (int pile : piles) {
                hours_needed += (pile + mid - 1) / mid;  // ceil division
            }
            
            if (hours_needed <= h) {
                // This speed is sufficient, try slower
                right = mid;
            } else {
                // Speed too slow, need faster
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
    public int minEatingSpeed(int[] piles, int h) {
        /**
         * Find minimum eating speed using binary search.
         */
        int left = 1;
        int right = Arrays.stream(piles).max().getAsInt();
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            
            // Calculate hours needed at this speed
            long hoursNeeded = 0;
            for (int pile : piles) {
                hoursNeeded += (pile + mid - 1) / mid;  // ceil division
            }
            
            if (hoursNeeded <= h) {
                // This speed is sufficient, try slower
                right = mid;
            } else {
                // Speed too slow, need faster
                left = mid + 1;
            }
        }
        
        return left;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum eating speed using binary search.
 * 
 * @param {number[]} piles - List of banana piles
 * @param {number} h - Hours until guards return
 * @return {number} - Minimum eating speed
 */
var minEatingSpeed = function(piles, h) {
    let left = 1;
    let right = Math.max(...piles);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        
        // Calculate hours needed at this speed
        let hoursNeeded = 0;
        for (const pile of piles) {
            hoursNeeded += Math.ceil(pile / mid);
        }
        
        if (hoursNeeded <= h) {
            // This speed is sufficient, try slower
            right = mid;
        } else {
            // Speed too slow, need faster
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
| **Time** | O(n log M) - n = number of piles, M = max pile size |
| **Space** | O(1) - Only uses a few variables |

---

## Approach 2: Linear Search (Brute Force)

This approach checks each possible speed from 1 to max(piles).

### Algorithm Steps

1. For speed from 1 to max(piles):
   - Calculate hours_needed for each speed
   - If hours_needed <= h, return current speed
2. Return max(piles) as fallback

### Code Implementation

````carousel
```python
import math
from typing import List

class Solution:
    def minEatingSpeed_linear(self, piles: List[int], h: int) -> int:
        """
        Find minimum eating speed using linear search.
        """
        for k in range(1, max(piles) + 1):
            hours_needed = sum(math.ceil(p / k) for p in piles)
            if hours_needed <= h:
                return k
        return max(piles)
```

<!-- slide -->
```cpp
class Solution {
public:
    int minEatingSpeed(vector<int>& piles, int h) {
        /**
         * Find minimum eating speed using linear search.
         */
        int max_pile = *max_element(piles.begin(), piles.end());
        
        for (int k = 1; k <= max_pile; k++) {
            long long hours_needed = 0;
            for (int pile : piles) {
                hours_needed += (pile + k - 1) / k;
            }
            if (hours_needed <= h) {
                return k;
            }
        }
        return max_pile;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minEatingSpeedLinear(int[] piles, int h) {
        /**
         * Find minimum eating speed using linear search.
         */
        int maxPile = Arrays.stream(piles).max().getAsInt();
        
        for (int k = 1; k <= maxPile; k++) {
            long hoursNeeded = 0;
            for (int pile : piles) {
                hoursNeeded += (pile + k - 1) / k;
            }
            if (hoursNeeded <= h) {
                return k;
            }
        }
        return maxPile;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum eating speed using linear search.
 * 
 * @param {number[]} piles - List of banana piles
 * @param {number} h - Hours until guards return
 * @return {number} - Minimum eating speed
 */
var minEatingSpeedLinear = function(piles, h) {
    const maxPile = Math.max(...piles);
    
    for (let k = 1; k <= maxPile; k++) {
        let hoursNeeded = 0;
        for (const pile of piles) {
            hoursNeeded += Math.ceil(pile / k);
        }
        if (hoursNeeded <= h) {
            return k;
        }
    }
    return maxPile;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * M) - n = number of piles, M = max pile size |
| **Space** | O(1) |

---

## Comparison of Approaches

| Aspect | Binary Search | Linear Search |
|--------|---------------|---------------|
| **Time Complexity** | O(n log M) | O(n * M) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Large inputs | Small inputs only |

**Best Approach:** Binary search is optimal for this problem and is required to handle large inputs efficiently.

---

## Why Binary Search Works for This Problem

Binary search is the optimal approach because:

1. **Monotonic Predicate**: The relationship between speed and hours_needed is monotonic
2. **Feasibility Testing**: We can efficiently check if a given speed works in O(n)
3. **Optimal Solution**: Binary search finds the minimum feasible speed in O(log M) iterations
4. **Large Input Handling**: The constraints (10^9 piles) require an efficient solution

The key insight is that if Koko can finish at speed `k`, she can also finish at any speed `k' > k`. This makes the problem suitable for binary search optimization.

---

## Related Problems

Based on similar themes (binary search, monotonic functions, optimization):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Search Insert Position | [Link](https://leetcode.com/problems/search-insert-position/) | Standard binary search |
| Binary Search | [Link](https://leetcode.com/problems/binary-search/) | Basic binary search |
| Sqrt(x) | [Link](https://leetcode.com/problems/sqrtx/) | Find square root using binary search |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Find Minimum in Rotated Sorted Array | [Link](https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/) | Binary search in rotated array |
| Search in Rotated Sorted Array | [Link](https://leetcode.com/problems/search-in-rotated-sorted-array/) | Search in rotated array |
| Capacity To Ship Packages Within D Days | [Link](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Similar binary search problem |
| Minimum Number of Days to Make m Bouquets | [Link](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) | Binary search on days |

### Pattern Reference

For more detailed explanations of the binary search pattern and its variations, see:
- **[Binary Search Pattern](/patterns/binary-search)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Binary Search Optimization

- [NeetCode - Koko Eating Bananas](https://www.youtube.com/watch?v=U2朋o6M8) - Clear explanation with visual examples
- [Back to Back SWE - Koko Eating Bananas](https://www.youtube.com/watch?v=ASoaQqCfo8U) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=SPwSyq3r6) - Official problem solution

### Related Concepts

- [Binary Search Complete Guide](https://www.youtube.com/watch?v=Mo9n3j5xTPA) - Understanding binary search
- [Monotonic Functions in Algorithms](https://www.youtube.com/watch?v=GYlZ35yaa8g) - Understanding monotonicity

---

## Follow-up Questions

### Q1: How would you handle very large pile sizes (up to 10^9)?

**Answer:** Use 64-bit integers (long long in C++, long in Java) to avoid overflow when calculating hours_needed. In Python, integers are arbitrary precision, so this is handled automatically.

---

### Q2: What if h equals the number of piles?

**Answer:** In this case, Koko can only eat one pile per hour, so the answer is max(piles). This is handled correctly by the binary search.

---

### Q3: How would you modify the solution to maximize the uneaten bananas (minimize leftover)?

**Answer:** Add a secondary objective to maximize leftover. You could first find the minimum speed that finishes in time, then check if eating slightly slower would leave more uneaten bananas while still meeting the deadline.

---

### Q4: Can you solve this without binary search using another approach?

**Answer:** Yes, you could use:
- **Heap-based simulation**: Try different speeds and use a priority queue (inefficient)
- **Mathematical approach**: Calculate exact hours needed for each possible speed (still requires search)
- **Linear search**: Check each speed from 1 to max (O(n*M), inefficient)

Binary search is the optimal approach.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single pile
- All piles same size
- h equals number of piles
- h equals sum of piles (can eat 1 per hour)
- Very large pile sizes
- Small h value (tight deadline)
- Large h value (loose deadline)

---

### Q6: How would you optimize the ceil division calculation?

**Answer:** Instead of using math.ceil() or floating-point division, use integer arithmetic: `(pile + speed - 1) / speed`. This avoids floating-point errors and is faster.

---

## Common Pitfalls

### 1. Integer Overflow
**Issue:** Using 32-bit integers for hours_needed can overflow when pile size * number of piles is large.

**Solution:** Use 64-bit integers (long long, long, or Python's int).

### 2. Incorrect Ceil Division
**Issue:** Using floating-point division can cause precision errors.

**Solution:** Use integer arithmetic: `(pile + k - 1) // k` for ceil division.

### 3. Off-by-One in Binary Search
**Issue:** Using incorrect comparison operators can cause infinite loops or wrong answers.

**Solution:** Use `while left < right` and adjust boundaries carefully.

### 4. Not Using Long for h
**Issue:** h can be up to 10^9, which fits in int, but intermediate calculations may overflow.

**Solution:** Use long/long long for all calculations.

---

## Summary

The **Koko Eating Bananas** problem demonstrates binary search optimization:

- **Binary Search**: Optimal with O(n log M) time and O(1) space
- **Key Insight**: Monotonic relationship between eating speed and hours needed
- **Feasibility Check**: Efficiently determine if a speed works in O(n)

The problem is a classic example of binary search on a monotonic predicate, where we find the minimum value that satisfies a condition.

### Pattern Summary

This problem exemplifies the **Binary Search - Monotonic Function** pattern, which is characterized by:
- Monotonic relationship between input and output
- Efficient feasibility checking
- Finding minimum/maximum feasible value
- Achieving O(log n) time complexity

For more details on this pattern and its variations, see the **[Binary Search Pattern](/patterns/binary-search)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/koko-eating-bananas/discuss/) - Community solutions and explanations
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed explanation
- [Understanding Ceil Division](https://www.geeksforgeeks.org/ceil-division/) - Integer ceil division
- [Pattern: Binary Search](/patterns/binary-search) - Comprehensive pattern guide
