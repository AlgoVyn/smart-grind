# Permutation Sequence

## Problem Description

The set `[1, 2, 3, ..., n]` contains a total of `n!` unique permutations.
By listing and labeling all of the permutations in order, we get the following sequence for `n = 3`:

```python
"123"
"132"
"213"
"231"
"312"
"321"
```

Given `n` and `k`, return the `kth` permutation sequence.

### Example 1

**Input:** `n = 3`, `k = 3`  
**Output:** `"213"`

### Example 2

**Input:** `n = 4`, `k = 9`  
**Output:** `"2314"`

### Example 3

**Input:** `n = 3`, `k = 1`  
**Output:** `"123"`

### Constraints

- `1 <= n <= 9`
- `1 <= k <= n!`

## Solution

```python
import math

class Solution:
    def getPermutation(self, n: int, k: int) -> str:
        nums = list(range(1, n+1))
        res = []
        k -= 1
        for i in range(n):
            fact = math.factorial(n - 1 - i)
            index = k // fact
            res.append(str(nums[index]))
            nums.pop(index)
            k %= fact
        return ''.join(res)
```

## Explanation

Use factorial to determine the position. For each position, calculate how many permutations per starting digit, choose the index, append and remove from available numbers.

### Step-by-step Approach

1. Initialize list of available numbers `[1, 2, ..., n]`.
2. Decrement `k` to use 0-based indexing.
3. For each position in the result:
   - Calculate factorial of remaining positions.
   - Determine index in available numbers.
   - Append the number at that index.
   - Remove it from available numbers.
   - Update `k` with remainder.
4. Return the joined result.

### Complexity Analysis

- **Time Complexity:** O(n^2)
- **Space Complexity:** O(n)
