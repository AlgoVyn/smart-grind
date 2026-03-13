# Minimum Number Of Days To Make M Bouquets

## Problem Description

You are given an integer array `bloomDay`, an integer `m` and an integer `k`. You want to make `m` bouquets. To make a bouquet, you need to use `k` adjacent flowers from the garden.

The garden consists of `n` flowers, the i-th flower will bloom in the `bloomDay[i]` and then can be used in exactly one bouquet.

Return the minimum number of days you need to wait to be able to make `m` bouquets from the garden. If it is impossible to make `m` bouquets, return `-1`.

**Link to problem:** [Minimum Number of Days to Make m Bouquets - LeetCode 1482](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/)

## Constraints
- `bloomDay.length == n`
- `1 <= n <= 10^5`
- `1 <= bloomDay[i] <= 10^9`
- `1 <= m <= 10^6`
- `1 <= k <= n`

---

## Pattern: Binary Search on Answer

This problem is a classic example of the **Binary Search on Answer** pattern. The pattern involves searching for the minimum feasible solution by testing candidate answers for feasibility.

### Core Concept

- **Monotonic Property**: If you can make m bouquets in D days, you can also make them in any day > D
- **Binary Search**: Search on the answer space (range of bloom days)
- **Feasibility Check**: For a given day, count how many bouquets can be made

---

## Examples

### Example

**Input:**
```
bloomDay = [1, 10, 3, 10, 2], m = 3, k = 1
```

**Output:**
```
3
```

**Explanation:** 
- Need 3 bouquets with 1 flower each
- Day 1: flowers bloomed: [1,_,_,_,_] → 1 bouquet
- Day 2: flowers bloomed: [1,_,_,_,2] → 2 bouquets  
- Day 3: flowers bloomed: [1,_,3,_,2] → 3 bouquets ✓

### Example 2: Impossible

**Input:**
```
bloomDay = [1, 10, 3, 10, 2], m = 3, k = 2
```

**Output:**
```
-1
```

**Explanation:** Need 3 bouquets × 2 flowers = 6 flowers, but only 5 exist. Impossible.

### Example 3

**Input:**
```
bloomDay = [7, 7, 7, 7, 12, 7, 7], m = 2, k = 3
```

**Output:**
```
12
```

**Explanation:**
- Need 2 bouquets with 3 flowers each
- Day 7: [x,x,x,x,_,x,x] → 1 bouquet
- Day 12: [x,x,x,x,x,x,x] → 2 bouquets ✓

---

## Intuition

The key insight is that the answer lies within the range [min(bloomDay), max(bloomDay)]. We can use binary search to find the minimum feasible day:

1. **Binary Search**: Find minimum day D where making m bouquets is possible
2. **Feasibility Check**: For each candidate day, count consecutive bloomed flowers
3. **Monotonicity**: If feasible at D, also feasible at any day > D

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Binary Search (Optimal)** - O(n log D) time
2. **Linear Scan** - O(n × maxDay) time (inefficient)

---

## Approach 1: Binary Search (Optimal)

This is the optimal solution with O(n log D) time complexity.

### Algorithm Steps

1. If m × k > n, return -1 (impossible)
2. Binary search between min and max bloomDay
3. For each mid day, check if m bouquets can be made
4. Return minimum feasible day

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minDays(self, bloomDay: List[int], m: int, k: int) -> int:
        """
        Find minimum days to make m bouquets using binary search.
        
        Args:
            bloomDay: Days when each flower blooms
            m: Number of bouquets needed
            k: Flowers per bouquet
            
        Returns:
            Minimum days to make m bouquets, or -1 if impossible
        """
        # Early termination: not enough flowers
        if m * k > len(bloomDay):
            return -1
        
        def can_make(days: int) -> bool:
            """Check if we can make at least m bouquets by given days."""
            bouquets = 0
            flowers = 0
            
            for day in bloomDay:
                if day <= days:
                    flowers += 1
                    if flowers == k:
                        bouquets += 1
                        flowers = 0
                        if bouquets >= m:
                            return True
                else:
                    flowers = 0
            
            return bouquets >= m
        
        # Binary search on answer
        left, right = min(bloomDay), max(bloomDay)
        
        while left < right:
            mid = (left + right) // 2
            if can_make(mid):
                right = mid
            else:
                left = mid + 1
        
        return left
```

<!-- slide -->
```cpp
class Solution {
public:
    int minDays(vector<int>& bloomDay, int m, int k) {
        // Early termination
        if (m * k > bloomDay.size()) return -1;
        
        auto canMake = [&](int days) -> bool {
            int bouquets = 0;
            int flowers = 0;
            
            for (int day : bloomDay) {
                if (day <= days) {
                    flowers++;
                    if (flowers == k) {
                        bouquets++;
                        flowers = 0;
                        if (bouquets >= m) return true;
                    }
                } else {
                    flowers = 0;
                }
            }
            return bouquets >= m;
        };
        
        int left = *min_element(bloomDay.begin(), bloomDay.end());
        int right = *max_element(bloomDay.begin(), bloomDay.end());
        
        while (left < right) {
            int mid = (left + right) / 2;
            if (canMake(mid)) {
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
    public int minDays(int[] bloomDay, int m, int k) {
        // Early termination
        if (m * k > bloomDay.length) return -1;
        
        int left = Integer.MAX_VALUE;
        int right = Integer.MIN_VALUE;
        for (int day : bloomDay) {
            left = Math.min(left, day);
            right = Math.max(right, day);
        }
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canMake(bloomDay, m, k, mid)) {
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        
        return left;
    }
    
    private boolean canMake(int[] bloomDay, int m, int k, int days) {
        int bouquets = 0;
        int flowers = 0;
        
        for (int day : bloomDay) {
            if (day <= days) {
                flowers++;
                if (flowers == k) {
                    bouquets++;
                    flowers = 0;
                    if (bouquets >= m) return true;
                }
            } else {
                flowers = 0;
            }
        }
        
        return bouquets >= m;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} bloomDay
 * @param {number} m
 * @param {number} k
 * @return {number}
 */
var minDays = function(bloomDay, m, k) {
    // Early termination
    if (m * k > bloomDay.length) return -1;
    
    const canMake = (days) => {
        let bouquets = 0;
        let flowers = 0;
        
        for (const day of bloomDay) {
            if (day <= days) {
                flowers++;
                if (flowers === k) {
                    bouquets++;
                    flowers = 0;
                    if (bouquets >= m) return true;
                }
            } else {
                flowers = 0;
            }
        }
        
        return bouquets >= m;
    };
    
    let left = Math.min(...bloomDay);
    let right = Math.max(...bloomDay);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (canMake(mid)) {
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
| **Time** | O(n log D) - n flowers, D = maxDay - minDay |
| **Space** | O(1) - only constant extra space |

---

## Approach 2: Linear Scan (Inefficient)

### Algorithm Steps

1. Start from day = min(bloomDay)
2. For each day, check if we can make m bouquets
3. If yes, return that day
4. If no, increment day and repeat

### Why It Works

This is a brute force approach that checks each day sequentially until finding a feasible day. It works but is inefficient.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minDays(self, bloomDay: List[int], m: int, k: int) -> int:
        """
        Find minimum days using linear scan (inefficient).
        """
        if m * k > len(bloomDay):
            return -1
        
        # Start from minimum day
        for day in range(min(bloomDay), max(bloomDay) + 1):
            if self.can_make(bloomDay, m, k, day):
                return day
        
        return -1
    
    def can_make(self, bloomDay, m, k, day):
        bouquets = 0
        flowers = 0
        
        for b in bloomDay:
            if b <= day:
                flowers += 1
                if flowers == k:
                    bouquets += 1
                    flowers = 0
                    if bouquets >= m:
                        return True
            else:
                flowers = 0
        
        return bouquets >= m
```

<!-- slide -->
```cpp
class Solution {
public:
    int minDays(vector<int>& bloomDay, int m, int k) {
        if (m * k > bloomDay.size()) return -1;
        
        int minDay = *min_element(bloomDay.begin(), bloomDay.end());
        int maxDay = *max_element(bloomDay.begin(), bloomDay.end());
        
        for (int day = minDay; day <= maxDay; day++) {
            if (canMake(bloomDay, m, k, day)) {
                return day;
            }
        }
        
        return -1;
    }
    
private:
    bool canMake(vector<int>& bloomDay, int m, int k, int day) {
        int bouquets = 0, flowers = 0;
        for (int b : bloomDay) {
            if (b <= day) {
                flowers++;
                if (flowers == k) {
                    bouquets++;
                    flowers = 0;
                    if (bouquets >= m) return true;
                }
            } else {
                flowers = 0;
            }
        }
        return bouquets >= m;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minDays(int[] bloomDay, int m, int k) {
        if (m * k > bloomDay.length) return -1;
        
        int minDay = Integer.MAX_VALUE;
        int maxDay = Integer.MIN_VALUE;
        for (int day : bloomDay) {
            minDay = Math.min(minDay, day);
            maxDay = Math.max(maxDay, day);
        }
        
        for (int day = minDay; day <= maxDay; day++) {
            if (canMake(bloomDay, m, k, day)) {
                return day;
            }
        }
        
        return -1;
    }
    
    private boolean canMake(int[] bloomDay, int m, int k, int day) {
        int bouquets = 0, flowers = 0;
        for (int b : bloomDay) {
            if (b <= day) {
                flowers++;
                if (flowers == k) {
                    bouquets++;
                    flowers = 0;
                    if (bouquets >= m) return true;
                }
            } else {
                flowers = 0;
            }
        }
        return bouquets >= m;
    }
}
```

<!-- slide -->
```javascript
var minDays = function(bloomDay, m, k) {
    if (m * k > bloomDay.length) return -1;
    
    const minDay = Math.min(...bloomDay);
    const maxDay = Math.max(...bloomDay);
    
    const canMake = (day) => {
        let bouquets = 0, flowers = 0;
        for (const b of bloomDay) {
            if (b <= day) {
                flowers++;
                if (flowers === k) {
                    bouquets++;
                    flowers = 0;
                    if (bouquets >= m) return true;
                }
            } else {
                flowers = 0;
            }
        }
        return bouquets >= m;
    };
    
    for (let day = minDay; day <= maxDay; day++) {
        if (canMake(day)) return day;
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n × D) - n flowers, D = maxDay - minDay |
| **Space** | O(1) - only constant extra space |

---

## Comparison of Approaches

| Aspect | Binary Search | Linear Scan |
|--------|--------------|-------------|
| **Time Complexity** | O(n log D) | O(n × D) |
| **Space Complexity** | O(1) | O(1) |
| **LeetCode Optimal** | ✅ Yes | ❌ No |

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Koko Eating Bananas | [Link](https://leetcode.com/problems/koko-eating-bananas/) | Binary search on eating speed |
| Find the Smallest Divisor | [Link](https://leetcode.com/problems/find-the-smallest-divisor/) | Binary search on divisor |
| Capacity To Ship Packages | [Link](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Binary search on capacity |

---

## Video Tutorial Links

- [NeetCode - Minimum Days to Make Bouquets](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Binary Search on Answer](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Pattern explanation

---

## Follow-up Questions

### Q1: Why binary search works here?

**Answer:** The property "can make m bouquets by day D" is monotonic - if true for D, it's also true for any day > D.

---

### Q2: How to handle very large bloomDay values?

**Answer:** Binary search handles large values efficiently since we only search O(log range) times.

---

### Q3: What edge cases should be tested?

**Answer:**
- m × k > n (impossible case)
- All flowers bloom same day
- k = 1 (single flower bouquets)
- m = 1 (single bouquet needed)

---

## Common Pitfalls

### 1. Overflow
**Issue**: m × k can overflow for large values

**Solution**: Use long integers or check m * k > n early

### 2. Range Bounds
**Answer**: Left bound should be min(bloomDay), not 0

---

## Summary

The **Minimum Number of Days to Make M Bouquets** problem demonstrates the **Binary Search on Answer** pattern:
- Use binary search on the range of possible days
- Check feasibility in O(n) for each candidate
- Achieve O(n log D) total complexity

For more details, see the **[Binary Search on Answer Pattern](/patterns/binary-search-answer)**.
