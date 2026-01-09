# Find The Most Competitive Subsequence

## Problem Description

Given an integer array `nums` and a positive integer `k`, return the **most competitive subsequence** of `nums` of size `k`.

### Definition: Competitive Subsequence

An array's subsequence is obtained by erasing some (possibly zero) elements from the original array.

A subsequence `a` is **more competitive** than subsequence `b` (of the same length) if, at the first position where they differ, subsequence `a` has a smaller number.

**Example:** `[1, 3, 4]` is more competitive than `[1, 3, 5]` because at the first differing position (index 2), `4 < 5`.

### Examples

**Example 1:**

| Parameter | Value |
|-----------|-------|
| `nums` | `[3, 5, 2, 6]` |
| `k` | `2` |
| **Output** | `[2, 6]` |

**Explanation:** Among all subsequences of size 2:
`{[3,5], [3,2], [3,6], [5,2], [5,6], [2,6]}`

The most competitive is `[2, 6]`.

**Example 2:**

| Parameter | Value |
|-----------|-------|
| `nums` | `[2, 4, 3, 3, 5, 4, 9, 6]` |
| `k` | `4` |
| **Output** | `[2, 3, 3, 4]` |

### Constraints

| Constraint | Description |
|------------|-------------|
| `nums.length` | `1 <= nums.length <= 10^5` |
| `nums[i]` | `0 <= nums[i] <= 10^9` |
| `k` | `1 <= k <= nums.length` |

## Solution

```python
from typing import List

class Solution:
    def mostCompetitive(self, nums: List[int], k: int) -> List[int]:
        stack = []
        
        for i, num in enumerate(nums):
            # Pop larger elements if we can still reach k elements
            while (stack and stack[-1] > num and 
                   len(stack) - 1 + len(nums) - i >= k):
                stack.pop()
            
            # Add current element if we need more
            if len(stack) < k:
                stack.append(num)
        
        return stack
```

### Approach

We use a **monotonic stack** to build the smallest possible subsequence of length `k`.

**Key Logic:**
1. For each element, try to remove larger elements from the stack
2. Only pop if removing still allows us to reach `k` elements
3. Add the current element if the stack isn't full yet

**Why it works:**
- The stack maintains the smallest possible prefix
- Each pop removes a larger element in favor of a smaller one
- The condition `len(stack) - 1 + len(nums) - i >= k` ensures we don't pop too many elements

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Each element is pushed and popped at most once |
| **Space** | `O(k)` — Stack stores at most `k` elements |

### Step-by-Step Example

For `nums = [3, 5, 2, 6]`, `k = 2`:

| Step | `num` | Stack | Action |
|------|-------|-------|--------|
| 1 | 3 | `[3]` | Stack < k, append |
| 2 | 5 | `[3, 5]` | Stack = k, no append |
| 3 | 2 | `[2]` | Pop 3 and 5 (can still reach k=2), append 2 |
| 4 | 6 | `[2, 6]` | Stack < k, append |

Result: `[2, 6]` ✓

---
