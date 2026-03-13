# Minimized Maximum of Products Distributed to Any Store

## Problem Description

You are given an integer `n` representing the number of retail stores. There are `m` product types with varying amounts given in the array `quantities`, where `quantities[i]` is the number of products of type `i`.

Distribute all products to the stores following these rules:

1. A store can receive **at most one product type** but can receive any amount of that type.
2. After distribution, let `x` be the **maximum number of products** given to any store.
3. **Minimize `x`**.

Return the minimum possible value of `x`.

**LeetCode Link:** [LeetCode 2064 - Minimized Maximum of Products Distributed to Any Store](https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/)

---

## Examples

### Example 1

**Input:**
```python
n = 6, quantities = [11, 6]
```

**Output:**
```python
3
```

**Optimal Distribution:**
- Type 0 (11 products): `[2, 3, 3, 3]` across 4 stores
- Type 1 (6 products): `[3, 3]` across 2 stores

Maximum per store: `max(2, 3, 3, 3, 3, 3) = 3`

### Example 2

**Input:**
```python
n = 7, quantities = [15, 10, 10]
```

**Output:**
```python
5
```

**Optimal Distribution:**
- Type 0 (15 products): `[5, 5, 5]` across 3 stores
- Type 1 (10 products): `[5, 5]` across 2 stores
- Type 2 (10 products): `[5, 5]` across 2 stores

Maximum per store: `max(5, 5, 5, 5, 5, 5, 5) = 5`

### Example 3

**Input:**
```python
n = 1, quantities = [100000]
```

**Output:**
```python
100000
```

**Explanation:** Only one store receives all 100000 products.

---

## Constraints

- `m == quantities.length`
- `1 <= m <= n <= 10^5`
- `1 <= quantities[i] <= 10^5`

---

## Pattern: Binary Search on Answer

This problem uses **Binary Search** on the answer space. The key insight is the monotonic property: if we can distribute with max X products per store, we can also distribute with any value greater than X. The feasibility check uses `ceil(q / x)` to calculate stores needed for each product type.

---

## Intuition

The key insight for this problem is recognizing the **monotonic property** of the problem:

> If it's possible to distribute products with a maximum of `x` products per store, then it's also possible to distribute with any value greater than `x`.

This monotonic property allows us to use **Binary Search** to find the minimum possible maximum.

### Key Observations

1. **Search Space**: The answer lies between 1 and `max(quantities)`. The minimum is 1 (if we have enough stores), and the maximum is the largest quantity (if we put each type in one store).

2. **Feasibility Check**: For a given maximum `x`, we can calculate how many stores we need:
   - For each product type with quantity `q`, we need `ceil(q / x)` stores
   - If total stores needed ≤ `n`, then `x` is feasible

3. **Ceiling Calculation**: 
   - Python: `(q + x - 1) // x` or `math.ceil(q / x)`
   - Other languages: similar approaches

4. **Binary Search**: We find the smallest `x` that is feasible.

### Algorithm Overview

1. **Define search range**: `left = 1`, `right = max(quantities)`
2. **Binary search**: While `left < right`:
   - Calculate `mid = (left + right) // 2`
   - Check if `mid` is feasible (can distribute with max `mid`)
   - If feasible: `right = mid` (try smaller)
   - If not feasible: `left = mid + 1` (need larger)
3. **Return `left`** (the minimum feasible maximum)

---

## Multiple Approaches with Code

We'll cover two main approaches:

1. **Binary Search on Answer** - Optimal solution
2. **Greedy with Mathematical Analysis** - Alternative approach

---

## Approach 1: Binary Search on Answer (Optimal)

### Algorithm Steps

1. Define search range: `left = 1`, `right = max(quantities)`
2. Create helper function to check feasibility
3. Perform binary search to find minimum feasible maximum
4. Return the smallest feasible value

### Why It Works

The monotonic property ensures that if we can distribute with max `x`, we can also distribute with any value > `x`. Binary search efficiently finds the boundary between feasible and infeasible values.

### Code Implementation

````carousel
```python
import math
from typing import List

class Solution:
    def minimizedMaximum(self, n: int, quantities: List[int]) -> int:
        def can_distribute(x: int) -> bool:
            """
            Check if we can distribute with max x products per store.
            
            Args:
                x: Maximum products allowed per store
                
            Returns:
                True if distribution is possible with max x, False otherwise
            """
            if x == 0:
                return False
            
            stores_needed = 0
            for q in quantities:
                # Calculate stores needed for this product type
                stores_needed += (q + x - 1) // x  # Equivalent to ceil(q / x)
            
            return stores_needed <= n
        
        # Binary search range
        left, right = 1, max(quantities)
        
        while left < right:
            mid = (left + right) // 2
            if can_distribute(mid):
                right = mid  # Can achieve, try smaller
            else:
                left = mid + 1  # Need larger max
        
        return left
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int minimizedMaximum(int n, vector<int>& quantities) {
        auto canDistribute = [&](int x) -> bool {
            if (x == 0) return false;
            
            long long storesNeeded = 0;
            for (int q : quantities) {
                storesNeeded += (q + x - 1) / x;  // ceil(q / x)
            }
            return storesNeeded <= n;
        };
        
        int left = 1;
        int right = *max_element(quantities.begin(), quantities.end());
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canDistribute(mid)) {
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
    public int minimizedMaximum(int n, int[] quantities) {
        // Helper to check if we can distribute with max x per store
        java.util.function.IntPredicate canDistribute = x -> {
            if (x == 0) return false;
            long storesNeeded = 0;
            for (int q : quantities) {
                storesNeeded += (q + x - 1) / x;  // ceil(q / x)
            }
            return storesNeeded <= n;
        };
        
        int left = 1;
        int right = java.util.Arrays.stream(quantities).max().getAsInt();
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canDistribute.test(mid)) {
                right = mid;
            } else {
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
 * @param {number} n
 * @param {number[]} quantities
 * @return {number}
 */
var minimizedMaximum = function(n, quantities) {
    const canDistribute = (x) => {
        if (x === 0) return false;
        
        let storesNeeded = 0;
        for (const q of quantities) {
            storesNeeded += Math.ceil(q / x);
        }
        return storesNeeded <= n;
    };
    
    let left = 1;
    let right = Math.max(...quantities);
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (canDistribute(mid)) {
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
| **Time** | O(m × log(max_q)) where m is number of product types and max_q is maximum quantity |
| **Space** | O(1) - constant extra space |

---

## Approach 2: Mathematical Analysis

### Algorithm Steps

1. Calculate minimum possible answer: at least `ceil(sum(quantities) / n)`
2. Use binary search within this tighter range
3. This approach is conceptually similar but starts with better bounds

### Why It Works

The theoretical minimum cannot be less than `ceil(total_products / n)` since we must distribute all products across n stores.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimizedMaximum(self, n: int, quantities: List[int]) -> int:
        total = sum(quantities)
        
        # Lower bound: ceil(total / n)
        left = (total + n - 1) // n
        right = max(quantities)
        
        def can_distribute(x: int) -> bool:
            if x == 0:
                return False
            stores_needed = sum((q + x - 1) // x for q in quantities)
            return stores_needed <= n
        
        while left < right:
            mid = (left + right) // 2
            if can_distribute(mid):
                right = mid
            else:
                left = mid + 1
        
        return left
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minimizedMaximum(int n, vector<int>& quantities) {
        long long total = 0;
        for (int q : quantities) total += q;
        
        // Lower bound: ceil(total / n)
        int left = (total + n - 1) / n;
        int right = *max_element(quantities.begin(), quantities.end());
        
        auto canDistribute = [&](int x) -> bool {
            if (x == 0) return false;
            long long storesNeeded = 0;
            for (int q : quantities) {
                storesNeeded += (q + x - 1) / x;
            }
            return storesNeeded <= n;
        };
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canDistribute(mid)) {
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
    public int minimizedMaximum(int n, int[] quantities) {
        long total = 0;
        for (int q : quantities) total += q;
        
        // Lower bound: ceil(total / n)
        int left = (int)((total + n - 1) / n);
        int right = java.util.Arrays.stream(quantities).max().getAsInt();
        
        java.util.function.IntPredicate canDistribute = x -> {
            if (x == 0) return false;
            long storesNeeded = 0;
            for (int q : quantities) {
                storesNeeded += (q + x - 1) / x;
            }
            return storesNeeded <= n;
        };
        
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canDistribute.test(mid)) {
                right = mid;
            } else {
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
 * @param {number} n
 * @param {number[]} quantities
 * @return {number}
 */
var minimizedMaximum = function(n, quantities) {
    const total = quantities.reduce((a, b) => a + b, 0);
    
    // Lower bound: ceil(total / n)
    let left = Math.ceil(total / n);
    let right = Math.max(...quantities);
    
    const canDistribute = (x) => {
        if (x === 0) return false;
        let storesNeeded = quantities.reduce((sum, q) => sum + Math.ceil(q / x), 0);
        return storesNeeded <= n;
    };
    
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (canDistribute(mid)) {
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
| **Time** | O(m × log(max_q - min_q)) - slightly tighter search space |
| **Space** | O(1) - constant extra space |

---

## Comparison of Approaches

| Aspect | Binary Search | Mathematical Analysis |
|--------|---------------|----------------------|
| **Time Complexity** | O(m × log(max_q)) | O(m × log(max_q - min_q)) |
| **Space Complexity** | O(1) | O(1) |
| **Implementation** | Simple | Slightly more complex |
| **Starting Bounds** | [1, max] | [ceil(total/n), max] |

**Best Approach:** Both approaches work. The basic binary search is simpler to understand and implement. The mathematical analysis provides slightly tighter bounds but the difference in practice is minimal.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Meta, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Binary Search, Greedy, Mathematical Reasoning

### Learning Outcomes

1. **Binary Search on Answer**: Learn to apply binary search to optimization problems
2. **Monotonic Property**: Identify when binary search can be used
3. **Feasibility Checking**: Write efficient checks for problem constraints

---

## Related Problems

Based on similar themes (Binary Search, Distribution problems):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Koko Eating Bananas | [Link](https://leetcode.com/problems/koko-eating-bananas/) | Binary search on eating speed |
| Minimum Number of Days to Make m Bouquets | [Link](https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/) | Binary search on days |
| Find the Smallest Divisor | [Link](https://leetcode.com/problems/find-the-smallest-divisor/) | Binary search on divisor |
| Capacity to Ship Packages | [Link](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Binary search on capacity |

### Pattern Reference

For more detailed explanations of the Binary Search pattern, see:
- **[Binary Search Pattern](/patterns/binary-search)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Minimized Maximum](https://www.youtube.com/watch?v=example)** - Clear explanation with visual examples
2. **[Binary Search on Answer](https://www.youtube.com/watch?v=example)** - Understanding the technique
3. **[LeetCode 2064 Solution](https://www.youtube.com/watch?v=example)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution if each store could receive multiple product types?

**Answer:** This would become a more complex packing problem. We'd need to use dynamic programming or a different approach entirely, as the monotonic property would no longer hold.

---

### Q2: What if we wanted to minimize the average instead of maximum?

**Answer:** The problem becomes different. We'd likely need to use different techniques like sorting and prefix sums, or formulate it as a different optimization problem.

---

### Q3: How does the solution handle when n equals m (equal number of stores and product types)?

**Answer:** When n >= m, the optimal answer becomes 1 since we can put each product type in its own store. The binary search will naturally find this, but we could add an early return: `if n >= m: return 1`.

---

### Q4: What's the minimum number of stores needed for a given maximum x?

**Answer:** The minimum stores needed is the sum of `ceil(q / x)` for each product type quantity q. This is exactly what the feasibility check calculates.

---

## Common Pitfalls

### 1. Wrong Formula for Stores Needed
**Issue**: Using `q / x` instead of `ceil(q / x)`.

**Solution**: Use `(q + x - 1) // x` in Python or equivalent in other languages.

### 2. Binary Search Condition
**Issue**: Using `while left <= right` can cause infinite loops or off-by-one errors.

**Solution**: Use `while left < right` and adjust boundaries carefully.

### 3. Edge Case: n >= m
**Issue**: Not handling the case where there are more stores than product types.

**Solution**: Early return: if `n >= m`, return 1.

### 4. Return Value
**Issue**: Returning `right` instead of `left` after binary search.

**Solution**: Return `left` as it represents the minimum feasible value.

---

## Summary

The **Minimized Maximum of Products Distributed to Any Store** problem demonstrates the power of **Binary Search on Answer** for optimization problems with monotonic properties.

Key takeaways:
1. Identify the monotonic property: if max X works, any value > X also works
2. Use binary search to efficiently find the minimum feasible maximum
3. The feasibility check calculates stores needed: `ceil(q / x)` for each product type
4. Time complexity is O(m × log(max_q)) where m is product types

This pattern is essential for solving many optimization problems in interviews.

### Pattern Summary

This problem exemplifies the **Binary Search on Answer** pattern, characterized by:
- Monotonic property of the solution space
- Efficient feasibility checking in O(m) time
- Logarithmic search over the answer space

For more details on this pattern and its variations, see the **[Binary Search Pattern](/patterns/binary-search)**.

---

## Additional Resources

- [LeetCode Problem 2064](https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/) - Official problem page
- [Binary Search - GeeksforGeeks](https://www.geeksforgeeks.org/binary-search/) - Detailed binary search explanation
- [Pattern: Binary Search](/patterns/binary-search) - Comprehensive pattern guide
