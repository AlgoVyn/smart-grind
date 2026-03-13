# Minimum Number of Removals to Make Mountain Array

## LeetCode Link

[Minimum Number of Removals to Make Mountain Array - LeetCode](https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/)

---

## Problem Description

You may recall that an array `arr` is a mountain array if and only if:

- `arr.length >= 3`
- There exists some index `i` (0-indexed) with `0 < i < arr.length - 1` such that:
  - `arr[0] < arr[1] < ... < arr[i - 1] < arr[i]`
  - `arr[i] > arr[i + 1] > ... > arr[arr.length - 1]`

Given an integer array `nums`, return the minimum number of elements to remove to make `nums` a mountain array.

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 3, 1]
```

**Output:**
```python
0
```

**Explanation:**
The array itself is a mountain array (peak at index 1 with 3 > 1 and 1 < 3), so we do not need to remove any elements.

### Example 2

**Input:**
```python
nums = [2, 1, 1, 5, 6, 2, 3, 1]
```

**Output:**
```python
3
```

**Explanation:**
One solution is to remove the elements at indices 0, 1, and 5, making the array `nums = [1, 5, 6, 3, 1]`.
- Increasing: 1 → 5 → 6
- Peak: 6
- Decreasing: 6 → 3 → 1

---

## Constraints

- `3 <= nums.length <= 1000`
- `1 <= nums[i] <= 10^9`
- It is guaranteed that you can make a mountain array out of `nums`.

---

## Pattern: Longest Increasing Subsequence (LIS) with Modification

This problem uses **Dynamic Programming** to find the longest mountain subsequence. Compute LIS from left and LDS (longest decreasing subsequence) from right, then combine.

---

## Intuition

The key insight for this problem is understanding that we need to find the **longest mountain subsequence** within the array, where:
- The sequence strictly increases to a peak
- Then strictly decreases from that peak

### Key Observations

1. **Mountain Decomposition**: A mountain array can be thought of as an increasing subsequence + a decreasing subsequence that share a peak.

2. **LIS and LDS**: For each index i, compute:
   - left[i]: Length of longest increasing subsequence ending at i
   - right[i]: Length of longest decreasing subsequence starting at i

3. **Valid Peak**: For i to be a valid peak, both left[i] > 1 AND right[i] > 1 (needs elements on both sides).

4. **Mountain Length**: For peak at i, mountain length = left[i] + right[i] - 1 (subtract 1 to avoid double-counting peak).

5. **Minimum Removals**: n - max_mountain_length

### Algorithm Overview

1. **Compute LIS from left**: For each index, find longest increasing subsequence ending at that index
2. **Compute LDS from right**: For each index, find longest decreasing subsequence starting at that index
3. **Find maximum valid mountain**: Iterate through all possible peaks and find max length
4. **Calculate minimum removals**: Return n - max_length

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **O(n²) DP** - Standard solution
2. **O(n log n) LIS** - Optimized using binary search

---

## Approach 1: O(n²) Dynamic Programming

### Algorithm Steps

1. Create `left` array: LIS ending at each index
2. Create `right` array: LDS starting at each index
3. For each index i (valid peak), compute mountain length
4. Return n - max_length

### Why It Works

The dynamic programming approach works because we independently compute:
- The longest increasing sequence leading TO each potential peak
- The longest decreasing sequence starting FROM each potential peak

The valid mountain at peak i is the combination of both.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimumMountainRemovals(self, nums: List[int]) -> int:
        """
        Find minimum removals to make mountain array using DP.
        
        Args:
            nums: Input array
            
        Returns:
            Minimum number of removals
        """
        n = len(nums)
        
        # left[i] = length of longest increasing subsequence ending at i
        left = [1] * n
        for i in range(1, n):
            for j in range(i):
                if nums[j] < nums[i]:
                    left[i] = max(left[i], left[j] + 1)
        
        # right[i] = length of longest decreasing subsequence starting at i
        right = [1] * n
        for i in range(n - 2, -1, -1):
            for j in range(i + 1, n):
                if nums[j] < nums[i]:
                    right[i] = max(right[i], right[j] + 1)
        
        # Find maximum valid mountain length
        max_len = 0
        for i in range(1, n - 1):
            # Valid peak needs elements on both sides
            if left[i] > 1 and right[i] > 1:
                max_len = max(max_len, left[i] + right[i] - 1)
        
        return n - max_len
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minimumMountainRemovals(vector<int>& nums) {
        int n = nums.size();
        
        // left[i] = length of longest increasing subsequence ending at i
        vector<int> left(n, 1);
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    left[i] = max(left[i], left[j] + 1);
                }
            }
        }
        
        // right[i] = length of longest decreasing subsequence starting at i
        vector<int> right(n, 1);
        for (int i = n - 2; i >= 0; i--) {
            for (int j = i + 1; j < n; j++) {
                if (nums[j] < nums[i]) {
                    right[i] = max(right[i], right[j] + 1);
                }
            }
        }
        
        // Find maximum valid mountain length
        int max_len = 0;
        for (int i = 1; i < n - 1; i++) {
            if (left[i] > 1 && right[i] > 1) {
                max_len = max(max_len, left[i] + right[i] - 1);
            }
        }
        
        return n - max_len;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumMountainRemovals(int[] nums) {
        int n = nums.length;
        
        // left[i] = length of longest increasing subsequence ending at i
        int[] left = new int[n];
        int[] right = new int[n];
        for (int i = 0; i < n; i++) {
            left[i] = 1;
            right[i] = 1;
        }
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    left[i] = Math.max(left[i], left[j] + 1);
                }
            }
        }
        
        for (int i = n - 2; i >= 0; i--) {
            for (int j = i + 1; j < n; j++) {
                if (nums[j] < nums[i]) {
                    right[i] = Math.max(right[i], right[j] + 1);
                }
            }
        }
        
        int max_len = 0;
        for (int i = 1; i < n - 1; i++) {
            if (left[i] > 1 && right[i] > 1) {
                max_len = Math.max(max_len, left[i] + right[i] - 1);
            }
        }
        
        return n - max_len;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} nums
 * @return {number}
 */
var minimumMountainRemovals = function(nums) {
    const n = nums.length;
    
    // left[i] = length of longest increasing subsequence ending at i
    const left = new Array(n).fill(1);
    for (let i = 1; i < n; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                left[i] = Math.max(left[i], left[j] + 1);
            }
        }
    }
    
    // right[i] = length of longest decreasing subsequence starting at i
    const right = new Array(n).fill(1);
    for (let i = n - 2; i >= 0; i--) {
        for (let j = i + 1; j < n; j++) {
            if (nums[j] < nums[i]) {
                right[i] = Math.max(right[i], right[j] + 1);
            }
        }
    }
    
    // Find maximum valid mountain length
    let max_len = 0;
    for (let i = 1; i < n - 1; i++) {
        if (left[i] > 1 && right[i] > 1) {
            max_len = Math.max(max_len, left[i] + right[i] - 1);
        }
    }
    
    return n - max_len;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Nested loops for LIS and LDS |
| **Space** | O(n) - Two arrays of size n |

---

## Approach 2: O(n log n) Using Binary Search

### Algorithm Steps

1. Use patience sorting technique with binary search for O(n log n) LIS
2. Compute LIS from left and right
3. Same combination logic as Approach 1

### Why It Works

The O(n log n) approach uses binary search instead of nested loops to find LIS. For each element, we find its position in the increasing sequence using binary search, giving O(n log n) complexity.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def minimumMountainRemovals(self, nums: List[int]) -> int:
        """
        Find minimum removals using O(n log n) LIS.
        """
        n = len(nums)
        
        def compute_lis(arr):
            """Compute LIS length for each position using binary search."""
            lis = []
            lis_len = [0] * n
            for i, num in enumerate(arr):
                pos = bisect.bisect_left(lis, num)
                if pos == len(lis):
                    lis.append(num)
                else:
                    lis[pos] = num
                lis_len[i] = pos + 1
            return lis_len
        
        left = compute_lis(nums)
        
        # For right, reverse the array and compute LIS, then reverse result
        right = compute_lis(nums[::-1])[::-1]
        
        max_len = 0
        for i in range(1, n - 1):
            if left[i] > 1 and right[i] > 1:
                max_len = max(max_len, left[i] + right[i] - 1)
        
        return n - max_len
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minimumMountainRemovals(vector<int>& nums) {
        int n = nums.size();
        
        auto computeLIS = [&](const vector<int>& arr) {
            vector<int> lis;
            vector<int> lisLen(n);
            for (int i = 0; i < n; i++) {
                int num = arr[i];
                auto it = lower_bound(lis.begin(), lis.end(), num);
                if (it == lis.end()) {
                    lis.push_back(num);
                } else {
                    *it = num;
                }
                lisLen[i] = lis.size();
            }
            return lisLen;
        };
        
        vector<int> left = computeLIS(nums);
        
        vector<int> reversed = nums;
        reverse(reversed.begin(), reversed.end());
        vector<int> rightReversed = computeLIS(reversed);
        vector<int> right(n);
        for (int i = 0; i < n; i++) {
            right[i] = rightReversed[n - 1 - i];
        }
        
        int max_len = 0;
        for (int i = 1; i < n - 1; i++) {
            if (left[i] > 1 && right[i] > 1) {
                max_len = max(max_len, left[i] + right[i] - 1);
            }
        }
        
        return n - max_len;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minimumMountainRemovals(int[] nums) {
        int n = nums.length;
        
        int[] left = computeLIS(nums);
        
        // Reverse and compute LIS
        int[] reversed = new int[n];
        for (int i = 0; i < n; i++) {
            reversed[i] = nums[n - 1 - i];
        }
        int[] rightReversed = computeLIS(reversed);
        int[] right = new int[n];
        for (int i = 0; i < n; i++) {
            right[i] = rightReversed[n - 1 - i];
        }
        
        int max_len = 0;
        for (int i = 1; i < n - 1; i++) {
            if (left[i] > 1 && right[i] > 1) {
                max_len = Math.max(max_len, left[i] + right[i] - 1);
            }
        }
        
        return n - max_len;
    }
    
    private int[] computeLIS(int[] arr) {
        int n = arr.length;
        List<Integer> lis = new ArrayList<>();
        int[] lisLen = new int[n];
        
        for (int i = 0; i < n; i++) {
            int pos = Collections.binarySearch(lis, arr[i]);
            if (pos < 0) {
                pos = -(pos + 1);
            }
            if (pos == lis.size()) {
                lis.add(arr[i]);
            } else {
                lis.set(pos, arr[i]);
            }
            lisLen[i] = pos + 1;
        }
        
        return lisLen;
    }
}
```

<!-- slide -->
```javascript
var minimumMountainRemovals = function(nums) {
    const n = nums.length;
    
    const computeLIS = (arr) => {
        const lis = [];
        const lisLen = new Array(n);
        for (let i = 0; i < n; i++) {
            const num = arr[i];
            const pos = bisectLeft(lis, num);
            if (pos === lis.length) {
                lis.push(num);
            } else {
                lis[pos] = num;
            }
            lisLen[i] = pos + 1;
        }
        return lisLen;
    };
    
    const left = computeLIS(nums);
    
    const reversed = [...nums].reverse();
    const rightReversed = computeLIS(reversed);
    const right = new Array(n);
    for (let i = 0; i < n; i++) {
        right[i] = rightReversed[n - 1 - i];
    }
    
    let max_len = 0;
    for (let i = 1; i < n - 1; i++) {
        if (left[i] > 1 && right[i] > 1) {
            max_len = Math.max(max_len, left[i] + right[i] - 1);
        }
    }
    
    return n - max_len;
};

function bisectLeft(arr, target) {
    let left = 0, right = arr.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Binary search for each element |
| **Space** | O(n) - Arrays for storing LIS lengths |

---

## Comparison of Approaches

| Aspect | Approach 1 (O(n²)) | Approach 2 (O(n log n)) |
|--------|-------------------|------------------------|
| **Time Complexity** | O(n²) | O(n log n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | Moderate |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use either based on constraints. For n ≤ 1000, O(n²) is sufficient.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Google, Apple
- **Difficulty**: Medium
- **Concepts Tested**: LIS, LDS, Dynamic Programming, Binary Search

### Learning Outcomes

1. **Combining Subproblems**: Learn to combine two related DP solutions
2. **Peak Validation**: Understand valid mountain constraints
3. **Optimization**: See how O(n log n) improves over O(n²)

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Increasing Subsequence | [Link](https://leetcode.com/problems/longest-increasing-subsequence/) | Core concept |
| Longest Mountain in Array | [Link](https://leetcode.com/problems/longest-mountain-in-array/) | Related |
| Valid Mountain Array | [Link](https://leetcode.com/problems/valid-mountain-array/) | Simpler version |
| LIS with DP | [Link](https://leetcode.com/problems/longest-increasing-subsequence-ii/) | Extension |

### Pattern Reference

For more detailed explanations, see:
- **[Dynamic Programming Pattern](/patterns/dynamic-programming)**

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Minimum Mountain Removals](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[LIS Problem Explained](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Understanding LIS

---

## Follow-up Questions

### Q1: How would you modify to find the actual elements to remove?

**Answer:** Track which indices are part of the longest mountain using backtracking, then return all indices not in that mountain.

---

### Q2: What if duplicates were allowed in the mountain?

**Answer:** The problem specifies strictly increasing/decreasing. If duplicates were allowed, you'd use non-strict comparisons in the DP.

---

### Q3: Can you use greedy approach?

**Answer:** No, greedy doesn't work because local最优 choices don't lead to global最优. For example, picking the highest peak might leave no valid decreasing sequence.

---

### Q4: How does this relate to Longest Bitonic Subsequence?

**Answer:** This IS essentially finding the Longest Bitonic Subsequence (LBS), but asking for minimum removals. LBS = LIS from left + LDS from right - 1.

---

### Q5: What if array length is very large (10^5)?

**Answer:** You'd need the O(n log n) approach using binary search. The O(n²) would be too slow.

---

### Q6: How do you handle equal elements?

**Answer:** The problem requires STRICTLY increasing/decreasing, so equal elements cannot be part of the mountain. Use strict comparison (<) in DP.

---

## Common Pitfalls

### 1. Peak Validation
**Issue**: Peak must have left[i] > 1 AND right[i] > 1 (can't be at edges).

**Solution**: Always check both conditions before considering index as valid peak.

### 2. Double Counting
**Issue**: Subtract 1 for the peak when combining left + right.

**Solution**: Mountain length = left[i] + right[i] - 1

### 3. Strictly Increasing/Decreasing
**Issue**: Both sides must be strictly monotonic, not non-decreasing.

**Solution**: Use strict comparison (<) in DP, not (<=).

---

## Summary

The **Minimum Number of Removals to Make Mountain Array** problem demonstrates combining two related DP solutions (LIS and LDS).

Key takeaways:
1. Find longest increasing subsequence ending at each index
2. Find longest decreasing subsequence starting at each index
3. Combine at valid peaks: left[i] + right[i] - 1
4. Minimum removals = n - max_mountain_length

This problem is essential for understanding bitonic subsequences and combining DP solutions.

### Pattern Summary

This problem exemplifies the **Longest Bitonic Subsequence** pattern, characterized by:
- Computing LIS from left
- Computing LDS from right
- Combining at valid peak points

For more details, see the **[Dynamic Programming Pattern](/patterns/dynamic-programming)**.

---

## Additional Resources

- [LeetCode Problem 1671](https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/) - Official problem page
- [LIS - GeeksforGeeks](https://www.geeksforgeeks.org/longest-increasing-subsequence/) - Detailed explanation
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive guide
