# Maximum Candies Allocated to K Children

## Problem Description

You are given a 0-indexed integer array `candies`. Each element `candies[i]` denotes a pile of candies. You can divide each pile into any number of sub-piles, but you cannot merge two piles together.

You are also given an integer `k`. Allocate piles of candies to `k` children such that each child gets the same number of candies. Each child can receive candies from only one pile, and some piles may go unused.

Return the maximum number of candies each child can get.

**LeetCode Link:** [Maximum Candies Allocated to K Children - LeetCode 2226](https://leetcode.com/problems/maximum-candies-allocated-to-k-children/)

---

## Pattern:

Binary Search on Answer

This problem uses the **Binary Search** pattern on the answer space. The key insight is the **monotonic property**: if we can give each child X candies, we can also give each child any value less than X. This allows binary search to find the maximum feasible value efficiently.

## Common Pitfalls

- **Wrong binary search bounds**: Lower bound should be 1, upper bound should be max(candies). Don't forget to check if total < k (return 0).
- **Off-by-one in feasibility check**: Use `c // mid` to count how many piles of size mid we can create from each pile.
- **Integer overflow**: k can be up to 10^12, so use appropriate types (long long in C++/Java).
- **Early exit optimization**: Exit the feasibility loop early when count >= k to save time.

---

## Problem Description

You are given a 0-indexed integer array `candies`. Each element `candies[i]` denotes a pile of candies. You can divide each pile into any number of sub-piles, but you cannot merge two piles together.

You are also given an integer `k`. Allocate piles of candies to `k` children such that each child gets the same number of candies. Each child can receive candies from only one pile, and some piles may go unused.

Return the maximum number of candies each child can get.

---

## Examples

### Example

**Input:**
```python
candies = [5, 8, 6], k = 3
```

**Output:**
```python
5
```

**Explanation:**
- Divide `candies[1]` (8) into two piles: 5 and 3
- Divide `candies[2]` (6) into two piles: 5 and 1
- Now we have piles: 5, 5, 3, 5, 1
- Allocate three piles of size 5 to three children
- Each child gets 5 candies

### Example 2

**Input:**
```python
candies = [2, 5], k = 11
```

**Output:**
```python
0
```

**Explanation:** There are only 7 candies total but 11 children. It's impossible to give each child at least one candy, so return 0.

---

## Constraints

- `1 <= candies.length <= 10^5`
- `1 <= candies[i] <= 10^7`
- `1 <= k <= 10^12`

---

## Intuition

The key insight is that the answer (maximum candies per child) has a **monotonic property**:

- If we can give each child `x` candies, we can also give each child any value less than `x`
- If we cannot give each child `x` candies, we cannot give each child any value greater than `x`

This monotonicity allows us to use **binary search** on the answer space.

### Binary Search Bounds

- **Lower bound (left)**: 1 (minimum possible, assuming k <= total candies)
- **Upper bound (right)**: max(candies) (we can't give more than the largest pile)
- **Edge case**: If total candies < k, return 0 immediately

### Feasibility Check

For a given candy count `x`:
- Count how many piles of size `x` we can create: `sum(candies[i] // x)`
- If the count >= k, then `x` is feasible (we can allocate to k children)
- Otherwise, `x` is not feasible

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Binary Search on Answer** - Optimal O(n log M) solution
2. **Linear Scan with Optimization** - Less efficient but intuitive
3. **Priority Queue Approach** - Alternative greedy solution

---

## Approach 1: Binary Search on Answer (Optimal)

This is the most efficient approach that leverages binary search on the answer space.

### Algorithm Steps

1. **Edge case**: If total candies < k, return 0
2. **Initialize binary search bounds**:
   - left = 1 (minimum possible)
   - right = max(candies) (maximum possible)
3. **Binary search**:
   - While left <= right:
     - mid = (left + right) // 2
     - Check if we can create at least k piles of size mid
     - If yes, try larger (left = mid + 1)
     - If no, try smaller (right = mid - 1)
4. Return right (the largest feasible value)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumCandies(self, candies: List[int], k: int) -> int:
        # Edge case: not enough candies for each child
        if sum(candies) < k:
            return 0
        
        left, right = 1, max(candies)
        
        def can_allocate(mid: int) -> bool:
            """Check if we can allocate at least k piles of size mid"""
            count = 0
            for c in candies:
                count += c // mid
                if count >= k:  # Early exit for efficiency
                    return True
            return count >= k
        
        while left <= right:
            mid = (left + right) // 2
            if can_allocate(mid):
                left = mid + 1  # Try larger
            else:
                right = mid - 1  # Try smaller
        
        return right
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    long long maximumCandies(vector<int>& candies, long long k) {
        long long total = 0;
        int maxCandies = 0;
        for (int c : candies) {
            total += c;
            maxCandies = max(maxCandies, c);
        }
        
        if (total < k) return 0;
        
        long long left = 1, right = maxCandies;
        
        auto canAllocate = [&](long long mid) -> bool {
            long long count = 0;
            for (int c : candies) {
                count += c / mid;
                if (count >= k) return true;
            }
            return count >= k;
        };
        
        while (left <= right) {
            long long mid = left + (right - left) / 2;
            if (canAllocate(mid)) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return right;
    }
};
```
<!-- slide -->
```java
class Solution {
    public long maximumCandies(int[] candies, long k) {
        long total = 0;
        int maxCandies = 0;
        for (int c : candies) {
            total += c;
            maxCandies = Math.max(maxCandies, c);
        }
        
        if (total < k) return 0;
        
        long left = 1, right = maxCandies;
        
        while (left <= right) {
            long mid = left + (right - left) / 2;
            if (canAllocate(candies, k, mid)) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        
        return right;
    }
    
    private boolean canAllocate(int[] candies, long k, long mid) {
        long count = 0;
        for (int c : candies) {
            count += c / mid;
            if (count >= k) return true;
        }
        return count >= k;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} candies
 * @param {number} k
 * @return {number}
 */
var maximumCandies = function(candies, k) {
    const total = candies.reduce((a, b) => a + b, 0);
    const maxCandies = Math.max(...candies);
    
    if (total < k) return 0;
    
    let left = 1, right = maxCandies;
    
    const canAllocate = (mid) => {
        let count = 0;
        for (const c of candies) {
            count += Math.floor(c / mid);
            if (count >= k) return true;
        }
        return count >= k;
    };
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (canAllocate(mid)) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    
    return right;
};
```
````

### Step-by-Step Example

For `candies = [5, 8, 6]` and `k = 3`:

- Initial: left = 1, right = 8
- mid = 4: Can we create 3 piles of 4? 
  - 5 // 4 = 1, 8 // 4 = 2, 6 // 4 = 1 → Total = 4 ≥ 3 ✓
  - left = 5
- mid = 6: Can we create 3 piles of 6?
  - 5 // 6 = 0, 8 // 6 = 1, 6 // 6 = 1 → Total = 2 < 3 ✗
  - right = 5
- mid = 5: Can we create 3 piles of 5?
  - 5 // 5 = 1, 8 // 5 = 1, 6 // 5 = 1 → Total = 3 ≥ 3 ✓
  - left = 6
- left > right, exit
- Return right = 5

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n log M)` - n = array length, M = max value |
| **Space** | `O(1)` - Only a few variables |

---

## Approach 2: Linear Scan (Less Efficient)

A simpler but less efficient approach that scans from max downwards.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maximumCandies(self, candies: List[int], k: int) -> int:
        if sum(candies) < k:
            return 0
        
        max_candies = max(candies)
        
        # Try each possible value from max to 1
        for x in range(max_candies, 0, -1):
            count = 0
            for c in candies:
                count += c // x
                if count >= k:
                    return x
        
        return 0
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    long long maximumCandies(vector<int>& candies, long long k) {
        long long total = 0;
        int maxCandies = 0;
        for (int c : candies) {
            total += c;
            maxCandies = max(maxCandies, c);
        }
        
        if (total < k) return 0;
        
        for (int x = maxCandies; x > 0; x--) {
            long long count = 0;
            for (int c : candies) {
                count += c / x;
                if (count >= k) return x;
            }
        }
        
        return 0;
    }
};
```
<!-- slide -->
```java
class Solution {
    public long maximumCandies(int[] candies, long k) {
        long total = 0;
        int maxCandies = 0;
        for (int c : candies) {
            total += c;
            maxCandies = Math.max(maxCandies, c);
        }
        
        if (total < k) return 0;
        
        for (int x = maxCandies; x > 0; x--) {
            long count = 0;
            for (int c : candies) {
                count += c / x;
                if (count >= k) return x;
            }
        }
        
        return 0;
    }
}
```
<!-- slide -->
```javascript
var maximumCandies = function(candies, k) {
    const total = candies.reduce((a, b) => a + b, 0);
    const maxCandies = Math.max(...candies);
    
    if (total < k) return 0;
    
    for (let x = maxCandies; x > 0; x--) {
        let count = 0;
        for (const c of candies) {
            count += Math.floor(c / x);
            if (count >= k) return x;
        }
    }
    
    return 0;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n × M)` - Potentially very slow for large M |
| **Space** | `O(1)` - No extra space |

---

## Approach 3: Priority Queue (Alternative Greedy)

Use a max-heap to greedily split piles.

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def maximumCandies(self, candies: List[int], k: int) -> int:
        if sum(candies) < k:
            return 0
        
        # Use a max-heap (negative values) for largest piles
        # Each element: (-size, count_of_this_size)
        max_heap = [(-c, 1) for c in candies]
        heapq.heapify(max_heap)
        
        while k > 1:
            size, count = heapq.heappop(max_heap)
            size = -size
            
            # If this pile is too small to split further
            if size < 2:
                break
            
            # Split into two roughly equal parts
            new_size = size // 2
            heapq.heappush(max_heap, (-new_size, count))
            heapq.heappush(max_heap, (-(size - new_size), count))
            k -= 1
        
        # Return the smallest pile size in the heap
        return -max_heap[0][0] if max_heap else 0
```

**Note:** This approach doesn't guarantee optimal solution and is slower than binary search. It's included for educational purposes.
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k log n) - For k splits |
| **Space** | O(n) - Heap storage |

---

## Comparison of Approaches

| Aspect | Binary Search | Linear Scan | Priority Queue |
|--------|--------------|-------------|----------------|
| **Time Complexity** | O(n log M) | O(n × M) | O(k log n) |
| **Space Complexity** | O(1) | O(1) | O(n) |
| **Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Recommended** | ✅ Best | ❌ Slow | ❌ Suboptimal |

**Best Approach:** Binary search is optimal for this problem.

---

## Related Problems

### Binary Search on Answer

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Split Array Largest Sum | [LeetCode 410](https://leetcode.com/problems/split-array-largest-sum/) | Hard |
| Capacity to Ship Packages Within D Days | [LeetCode 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Medium |
| Koko Eating Bananas | [LeetCode 875](https://leetcode.com/problems/koko-eating-bananas/) | Medium |

### Similar Allocation Problems

| Problem | LeetCode Link | Difficulty |
|---------|---------------|------------|
| Painters Partition Problem | [GeeksforGeeks](https://practice.geeksforgeeks.org/problems/allocate-minimum-number-of-pages0937/1) | Hard |
| Allocate Books | [LeetCode 1909](https://leetcode.com/problems/validate-binary-search-tree/) | Medium |

---

## Video Tutorial Links

### Binary Search on Answer

- [Maximum Candies - NeetCode](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Binary Search Pattern](https://www.youtube.com/watch?v=0jN2cIoXK7Q) - General pattern
- [LeetCode Official Solution](https://www.youtube.com/watch?v=1L2OiLDbJ6E) - Official walkthrough

### Related Problems

- [Split Array Largest Sum](https://www.youtube.com/watch?v=hmV1s1q5k9I) - Similar problem
- [Koko Eating Bananas](https://www.youtube.com/watch?v=7j9lq2eMgvc) - Binary search variant

---

## Follow-up Questions

### Q1: How would you modify to handle the case where each child can get candies from at most 2 piles?

**Answer:** This becomes more complex. You'd need to track how many children get 1 pile vs 2 piles and ensure the total distribution is valid. A DP approach might be needed.

---

### Q2: What if each child must receive candies from exactly one pile (no splitting)?

**Answer:** This reduces to finding the k-th largest pile. Sort the piles in descending order and return the k-th element.

---

### Q3: How would you output the actual allocation scheme?

**Answer:** After finding the optimal value X with binary search, run the feasibility check again and track which piles are allocated to which child.

---

### Q4: What is the time complexity if k is very large (close to total candies)?

**Answer:** The binary search time complexity is still O(n log M), independent of k. The feasibility check is efficient because we can exit early when count >= k.

---

### Q5: Can this be solved without binary search using dynamic programming?

**Answer:** Not efficiently. The search space is too large for DP. Binary search is the optimal approach because of the monotonic property.

---

### Q6: How would you handle floating-point candy counts?

**Answer:** This problem assumes integer candies. If fractional candies were allowed, you'd need a different approach (like greedy allocation) since division would be exact.

---

### Q7: What edge cases should be tested?

**Answer:**
- k equals total candies (each child gets 1)
- k = 1 (whole array to one child)
- Single element array
- All elements are 1
- Large k (up to 10^12)
- Large values (candies up to 10^7)

---

### Q8: How would you verify correctness?

**Answer:** 
1. Edge case: return 0 if total < k
2. Monotonicity: verify that if X works, all Y < X also work
3. Binary search finds the maximum working value
4. Test with examples and edge cases

---

## Summary

The **Maximum Candies Allocated to K Children** problem demonstrates the **Binary Search on Answer** pattern:

- **Monotonic Property**: If we can give each child X candies, we can give each child any value less than X
- **Feasibility Check**: Count how many piles of size X we can create
- **Binary Search**: Find the maximum feasible X in O(log M) time

Key takeaways:
1. Always check if total < k (return 0)
2. Binary search bounds: [1, max(candies)]
3. Early exit in feasibility check for efficiency
4. This pattern applies to many similar allocation problems

This pattern is essential for solving optimization problems with monotonic constraints.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/maximum-candies-allocated-to-k-children/discuss/) - Community solutions
- [Binary Search - CP Algorithms](https://cp-algorithms.com/binary_search.html) - Binary search guide
- [Monotonic Search Space](https://leetcode.com/explore/interview/card/top-interview-questions-hard/) - Pattern explanation
