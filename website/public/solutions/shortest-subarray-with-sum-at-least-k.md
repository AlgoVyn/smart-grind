# 

## Pattern: Prefix Sum / Monotonic Queue

Shortest Subarray with Sum at Least K

## Problem Description

Given an integer array `nums` and an integer `k`, return the length of the shortest non-empty subarray of `nums` with a sum of at least `k`. If there is no such subarray, return `-1`.

A subarray is a contiguous part of an array.

## Examples

**Example 1:**
- Input: `nums = [1], k = 1`
- Output: `1`

**Example 2:**
- Input: `nums = [1,2], k = 4`
- Output: `-1`

**Example 3:**
- Input: `nums = [2,-1,2], k = 3`
- Output: `3`

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^5 <= nums[i] <= 10^5`
- `1 <= k <= 10^9`

---

## Intuition

This problem requires finding the shortest subarray with sum at least K, with the additional complexity of **handling negative numbers**. 

### Why Prefix Sums?

With prefix sums, we can compute any subarray sum in O(1):
- `sum(i, j) = prefix[j+1] - prefix[i]`

We need to find the smallest `j - i` where `prefix[j+1] - prefix[i] >= k`.

### Why Monotonic Deque?

The key insight is to maintain a deque of indices with **strictly increasing** prefix sums. This allows us to efficiently find valid subarrays:

1. **Removing bad candidates**: When we encounter a new prefix sum that's smaller than some in our deque, those larger prefix sums can never form a shorter valid subarray. We remove them from the back.

2. **Finding valid subarrays**: For each position j, we check if the smallest prefix sum in our deque can form a valid subarray (with sum >= k). If so, we update our answer.

This is similar to the "sliding window minimum" pattern but optimized for finding shortest subarrays.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Monotonic Deque** - Optimal O(n) solution
2. **Binary Search with Prefix Sums** - O(n log n) solution  
3. **Brute Force with Optimization** - O(n²) baseline approach

---

## Approach 1: Monotonic Deque (Optimal)

This is the optimal solution that achieves O(n) time complexity using a monotonic deque.

### Algorithm Steps

1. Compute prefix sums for all positions (including position 0).
2. Maintain a deque of indices with **strictly increasing** prefix sums.
3. For each position j (from 0 to n):
   - Remove indices from the back while the current prefix sum is smaller or equal - these are "dominated" candidates.
   - Check if any valid subarray exists from the front of the deque.
   - Add the current index to the deque.
4. Return the minimum length found, or -1 if none exists.

### Why It Works

The monotonic deque maintains candidates that could form valid subarrays:
- Indices in the deque have increasing prefix sums
- When we find `prefix[j] - prefix[deque[0]] >= k`, we know this is the shortest subarray ending at j (because deque[0] has the smallest prefix sum)
- We remove from back when a better (smaller) prefix sum is found, as it dominates larger ones

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        """
        Find shortest subarray with sum at least k using monotonic deque.
        
        Args:
            nums: Input array of integers (can have negative numbers)
            k: Target sum threshold
            
        Returns:
            Length of shortest subarray with sum >= k, or -1 if none exists
        """
        n = len(nums)
        
        # Compute prefix sums: prefix[i] = sum of nums[0..i-1]
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        # Deque stores indices with strictly increasing prefix sums
        dq = deque()
        min_len = float('inf')
        
        for j in range(n + 1):
            # Remove indices from back that have larger or equal prefix sums
            # (they can never form a shorter valid subarray than current j)
            while dq and prefix[dq[-1]] >= prefix[j]:
                dq.pop()
            
            # Check if we found a valid subarray from the front
            while dq and prefix[j] - prefix[dq[0]] >= k:
                min_len = min(min_len, j - dq[0])
                dq.popleft()  # Remove this index as we've found shortest for it
            
            # Add current index to deque
            dq.append(j)
        
        return min_len if min_len != float('inf') else -1
```

<!-- slide -->
```cpp
#include <vector>
#include <deque>
using namespace std;

class Solution {
public:
    int shortestSubarray(vector<int>& nums, int k) {
        int n = nums.size();
        
        // Compute prefix sums
        vector<long long> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        // Deque stores indices with increasing prefix sums
        deque<int> dq;
        int minLen = INT_MAX;
        
        for (int j = 0; j <= n; j++) {
            // Remove indices from back with larger prefix sums
            while (!dq.empty() && prefix[dq.back()] >= prefix[j]) {
                dq.pop_back();
            }
            
            // Check for valid subarray from front
            while (!dq.empty() && prefix[j] - prefix[dq.front()] >= k) {
                minLen = min(minLen, j - dq.front());
                dq.pop_front();
            }
            
            dq.push_back(j);
        }
        
        return minLen == INT_MAX ? -1 : minLen;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int shortestSubarray(int[] nums, int k) {
        int n = nums.length;
        
        // Compute prefix sums
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        // Deque stores indices with increasing prefix sums
        Deque<Integer> dq = new LinkedList<>();
        int minLen = Integer.MAX_VALUE;
        
        for (int j = 0; j <= n; j++) {
            // Remove indices from back with larger prefix sums
            while (!dq.isEmpty() && prefix[dq.peekLast()] >= prefix[j]) {
                dq.pollLast();
            }
            
            // Check for valid subarray from front
            while (!dq.isEmpty() && prefix[j] - prefix[dq.peekFirst()] >= k) {
                minLen = Math.min(minLen, j - dq.pollFirst());
            }
            
            dq.addLast(j);
        }
        
        return minLen == Integer.MAX_VALUE ? -1 : minLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var shortestSubarray = function(nums, k) {
    const n = nums.length;
    
    // Compute prefix sums
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    // Deque stores indices with increasing prefix sums
    const dq = [];
    let minLen = Infinity;
    
    for (let j = 0; j <= n; j++) {
        // Remove indices from back with larger prefix sums
        while (dq.length > 0 && prefix[dq[dq.length - 1]] >= prefix[j]) {
            dq.pop();
        }
        
        // Check for valid subarray from front
        while (dq.length > 0 && prefix[j] - prefix[dq[0]] >= k) {
            minLen = Math.min(minLen, j - dq.shift());
        }
        
        dq.push(j);
    }
    
    return minLen === Infinity ? -1 : minLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each index is added and removed from deque at most once |
| **Space** | O(n) for prefix array and deque |

---

## Approach 2: Binary Search with Prefix Sums

This approach uses binary search on the answer (length) and checks if a valid subarray of that length exists.

### Algorithm Steps

1. Binary search on answer from 1 to n.
2. For each candidate length L:
   - Check if any subarray of length L has sum >= k
   - Use sliding window to compute sums efficiently
3. Return the minimum length found.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        
        # Compute prefix sums
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        def has_subarray_of_length(L: int) -> bool:
            """Check if there's a subarray of length L with sum >= k"""
            for i in range(n - L + 1):
                if prefix[i + L] - prefix[i] >= k:
                    return True
            return False
        
        # Binary search on answer
        left, right = 1, n
        answer = -1
        
        while left <= right:
            mid = (left + right) // 2
            if has_subarray_of_length(mid):
                answer = mid
                right = mid - 1
            else:
                left = mid + 1
        
        return answer
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int shortestSubarray(vector<int>& nums, int k) {
        int n = nums.size();
        
        // Compute prefix sums
        vector<long long> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        auto hasSubarrayOfLength = [&](int L) -> bool {
            for (int i = 0; i + L <= n; i++) {
                if (prefix[i + L] - prefix[i] >= k) {
                    return true;
                }
            }
            return false;
        };
        
        int left = 1, right = n, answer = -1;
        
        while (left <= right) {
            int mid = (left + right) / 2;
            if (hasSubarrayOfLength(mid)) {
                answer = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        
        return answer;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int shortestSubarray(int[] nums, int k) {
        int n = nums.length;
        
        // Compute prefix sums
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        int left = 1, right = n, answer = -1;
        
        while (left <= right) {
            int mid = (left + right) / 2;
            if (hasSubarrayOfLength(prefix, n, mid, k)) {
                answer = mid;
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        
        return answer;
    }
    
    private boolean hasSubarrayOfLength(long[] prefix, int n, int L, int k) {
        for (int i = 0; i + L <= n; i++) {
            if (prefix[i + L] - prefix[i] >= k) {
                return true;
            }
        }
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var shortestSubarray = function(nums, k) {
    const n = nums.length;
    
    // Compute prefix sums
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    const hasSubarrayOfLength = (L) => {
        for (let i = 0; i + L <= n; i++) {
            if (prefix[i + L] - prefix[i] >= k) {
                return true;
            }
        }
        return false;
    };
    
    let left = 1, right = n, answer = -1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (hasSubarrayOfLength(mid)) {
            answer = mid;
            right = mid - 1;
        } else {
            left = mid + 1;
        }
    }
    
    return answer;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - binary search with O(n) check |
| **Space** | O(n) for prefix array |

---

## Approach 3: Brute Force with Optimization

A baseline approach with O(n²) complexity, useful for understanding but not optimal.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def shortestSubarray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        
        # Compute prefix sums
        prefix = [0] * (n + 1)
        for i in range(n):
            prefix[i + 1] = prefix[i] + nums[i]
        
        min_len = float('inf')
        
        # Try all possible subarrays
        for i in range(n):
            for j in range(i + 1, n + 1):
                if prefix[j] - prefix[i] >= k:
                    min_len = min(min_len, j - i)
                    break  # Found shortest for this starting point
        
        return min_len if min_len != float('inf') else -1
```

<!-- slide -->
```cpp
#include <vector>
#include <climits>
using namespace std;

class Solution {
public:
    int shortestSubarray(vector<int>& nums, int k) {
        int n = nums.size();
        
        vector<long long> prefix(n + 1, 0);
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        int minLen = INT_MAX;
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j <= n; j++) {
                if (prefix[j] - prefix[i] >= k) {
                    minLen = min(minLen, j - i);
                    break;
                }
            }
        }
        
        return minLen == INT_MAX ? -1 : minLen;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int shortestSubarray(int[] nums, int k) {
        int n = nums.length;
        
        long[] prefix = new long[n + 1];
        for (int i = 0; i < n; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
        
        int minLen = Integer.MAX_VALUE;
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j <= n; j++) {
                if (prefix[j] - prefix[i] >= k) {
                    minLen = Math.min(minLen, j - i);
                    break;
                }
            }
        }
        
        return minLen == Integer.MAX_VALUE ? -1 : minLen;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var shortestSubarray = function(nums, k) {
    const n = nums.length;
    
    const prefix = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefix[i + 1] = prefix[i] + nums[i];
    }
    
    let minLen = Infinity;
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j <= n; j++) {
            if (prefix[j] - prefix[i] >= k) {
                minLen = Math.min(minLen, j - i);
                break;
            }
        }
    }
    
    return minLen === Infinity ? -1 : minLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - double loop |
| **Space** | O(n) for prefix array |

---

## Comparison of Approaches

| Aspect | Monotonic Deque | Binary Search | Brute Force |
|--------|-----------------|---------------|-------------|
| **Time Complexity** | O(n) | O(n log n) | O(n²) |
| **Space Complexity** | O(n) | O(n) | O(n) |
| **Best For** | Large inputs | Moderate inputs | Small inputs/verification |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |

---

## Why This Problem is Important

### Interview Relevance
- **Frequency**: Frequently asked in technical interviews
- **Companies**: Amazon, Apple, Meta, Goldman Sachs
- **Difficulty**: Hard
- **Concepts**: Prefix sums, monotonic data structures, sliding window

### Key Learnings
1. **Prefix sums**: Essential for O(1) subarray sum queries
2. **Monotonic deque**: Powerful for maintaining sorted candidates
3. **Handling negatives**: Why simple sliding window doesn't work here
4. **Optimization insight**: Removing dominated candidates

---

## Related Problems

### Same Pattern (Prefix Sums + Monotonic)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Shortest Subarray with Sum at Least K | [Link](https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/) | Hard | This problem |
| Maximum Size Subarray Sum Equals K | [Link](https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/) | Medium | Similar prefix sum |
| Subarray Sums Divisible by K | [Link](https://leetcode.com/problems/subarray-sums-divisible-by-k/) | Medium | Prefix sum modulo |

### Similar Concepts

| Problem | LeetCode Link | Difficulty | Related Technique |
|---------|---------------|------------|-------------------|
| Minimum Size Subarray Sum | [Link](https://leetcode.com/problems/minimum-size-subarray-sum/) | Medium | Sliding window (positive only) |
| Number of Subarrays with Bounded Maximum | [Link](https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/) | Hard | Prefix sum variations |
| Longest Subarray with Sum K | [Link](https://practice.geeksforgeeks.org/problems/longest-subarray-with-sum-k/1) | Medium | Hash map prefix sum |

---

## Video Tutorial Links

### Monotonic Deque Technique

1. **[Shortest Subarray with Sum at Least K - NeetCode](https://www.youtube.com/watch?v=0wD3oV9-4j0)** - Clear explanation with visual examples
2. **[LeetCode 862 - Shortest Subarray](https://www.youtube.com/watch?v=oG5aQhz3G1A)** - Detailed walkthrough
3. **[Monotonic Queue Pattern](https://www.youtube.com/watch?v=2nrcj2dQvjQ)** - Understanding monotonic queues

### Prefix Sum Concepts

- **[Prefix Sum Array](https://www.youtube.com/watch?v=3Q-oJ7oJ3Xk)** - Foundation concept
- **[Sliding Window vs Prefix Sum](https://www.youtube.com/watch?v=M8N5mT2WZF8)** - Comparison

---

## Follow-up Questions

### Q1: Why can't we use a standard sliding window approach here?

**Answer:** Standard sliding window only works when all numbers are positive, because we can only expand the window when the sum is too small. With negative numbers, adding more elements could decrease the sum, so we need a different approach. The monotonic deque handles this by considering all possible starting points.

---

### Q2: How does the monotonic deque maintain efficiency?

**Answer:** The deque maintains indices in increasing order of their prefix sums. This allows us to:
1. Efficiently remove "dominated" candidates from the back (those with larger prefix sums)
2. Quickly find the best starting point from the front (smallest prefix sum)
Each index is added and removed at most once, giving O(n) total time.

---

### Q3: What if k is negative?

**Answer:** If k <= 0, any subarray would satisfy the condition. The shortest would be length 1. You can add an early check: if k <= 0, return 1.

---

### Q4: How would you modify to find the longest subarray with sum at least k?

**Answer:** Instead of minimizing j - i, you would maximize it. The approach would be similar but you'd track the maximum length when prefix[j] - prefix[i] >= k.

---

### Q5: What if you need to return the actual subarray indices?

**Answer:** When you find a valid subarray (update min_len), also store the starting and ending indices: start = dq[0], end = j - 1. Return these indices along with the length.

---

### Q6: How would you handle very large k values (like 10^15)?

**Answer:** The algorithm still works because we use long long (64-bit integers) for prefix sums. Python handles arbitrary precision automatically. The key is ensuring your data type can hold sums up to n * max(|nums[i]|).

---

### Q7: What edge cases should you test?

**Answer:**
- Single element array: [5], k=5 → answer 1
- No valid subarray: [1,2], k=10 → answer -1
- All negative numbers: [-1,-2,-3], k=-2 → answer 1
- Mix of positive and negative: [2,-1,2], k=3 → answer 3
- k equals exactly an existing sum
- Empty array (not allowed per constraints)

---

### Q8: How does this relate to finding the shortest path in a graph?

**Answer:** This can be viewed as a shortest path problem where each prefix sum is a node, and edges represent subarrays. The monotonic deque finds the shortest path from prefix[0] to any prefix where the difference >= k.

---

### Q9: Can you use a hash map approach instead?

**Answer:** Yes, but only if all numbers are non-negative (similar to "Minimum Size Subarray Sum"). With negative numbers, hash maps become less efficient because multiple prefix sums can map to the same target.

---

### Q10: What makes this problem harder than Minimum Size Subarray Sum?

**Answer:** In "Minimum Size Subarray Sum" (positive numbers only), we can use a simple sliding window. Here, the presence of negative numbers breaks that approach because we can't guarantee that extending the window will increase the sum. The monotonic deque elegantly handles this by considering all possibilities.

---

## Common Pitfalls

### 1. Not Using Long/Long Long
**Issue**: Prefix sums can exceed 32-bit integer range.

**Solution**: Use 64-bit integers (long long in C++, long in Java, Python handles it automatically).

### 2. Wrong Deque Operations Order
**Issue**: Removing from back before checking from front.

**Solution**: Always check for valid subarrays from the front (smallest prefix sum) before removing dominated candidates from the back.

### 3. Off-by-One in Prefix Sum Indexing
**Issue**: prefix[i] vs prefix[i+1] confusion.

**Solution**: Be consistent. In our implementation, prefix[i] = sum of first i elements (0 to i-1), so subarray sum from i to j-1 is prefix[j] - prefix[i].

### 4. Not Handling Empty Result
**Issue**: Returning min_len when no valid subarray exists.

**Solution**: Check if min_len was updated; if not, return -1.

---

## Summary

The **Shortest Subarray with Sum at Least K** problem demonstrates the power of combining **prefix sums** with a **monotonic deque**:

- **Prefix sums**: Convert subarray sum query to difference of two prefix values
- **Monotonic deque**: Maintain sorted candidates, remove dominated ones efficiently
- **O(n) solution**: Each index added/removed at most once

This pattern is essential for problems involving:
- Subarray sums with negative numbers
- Shortest subarrays with constraints
- Sliding window minimum/maximum variations

The key insight is that by maintaining indices with increasing prefix sums, we can efficiently find the shortest valid subarray ending at each position.
