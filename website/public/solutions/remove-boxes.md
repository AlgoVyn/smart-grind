# Remove Boxes

## Problem Description

You are given several boxes with different colors represented by different positive numbers.

You may experience several rounds to remove boxes until there is no box left. Each time you can choose some continuous boxes with the same color (i.e., composed of `k` boxes, `k >= 1`), remove them and get `k * k` points.

Return the maximum points you can get.

### Example 1

**Input:**
```python
boxes = [1,3,2,2,2,3,4,3,1]
```

**Output:**
```python
23
```

**Explanation:**
```python
[1, 3, 2, 2, 2, 3, 4, 3, 1] 
----> [1, 3, 3, 4, 3, 1] (3*3=9 points) 
----> [1, 3, 3, 3, 1] (1*1=1 points) 
----> [1, 1] (3*3=9 points) 
----> [] (2*2=4 points)
```

### Example 2

**Input:**
```python
boxes = [1,1,1]
```

**Output:**
```python
9
```

### Example 3

**Input:**
```python
boxes = [1]
```

**Output:**
```python
1
```

### Constraints

- `1 <= boxes.length <= 100`
- `1 <= boxes[i] <= 100`

## Solution

```python
from typing import List

class Solution:
    def removeBoxes(self, boxes: List[int]) -> int:
        n = len(boxes)
        memo = {}
        
        def dp(l, r, k):
            if l > r:
                return 0
            if (l, r, k) in memo:
                return memo[(l, r, k)]
            
            # Compress consecutive boxes of the same color
            while r > l and boxes[r] == boxes[r - 1]:
                r -= 1
                k += 1
            
            # Option 1: Remove the group at r
            res = dp(l, r - 1, 0) + (k + 1) ** 2
            
            # Option 2: Merge with a previous box of the same color
            for i in range(l, r):
                if boxes[i] == boxes[r]:
                    res = max(res, dp(l, i, k + 1) + dp(i + 1, r - 1, 0))
            
            memo[(l, r, k)] = res
            return res
        
        return dp(0, n - 1, 0)
```

## Explanation

This problem requires maximizing points by removing continuous boxes of the same color, getting `k*k` points for `k` boxes.

### Approach

Use recursive DP with memoization. `dp(l, r, k)` returns the max points for subarray `l` to `r` with `k` additional boxes of the same color as `boxes[r]` after `r`.

### Step-by-Step Explanation

1. **Base Case:** If `l > r`, return 0.

2. **Compress:** Move `r` left while `boxes[r] == boxes[r-1]`, increment `k`.

3. **Option 1:** Remove the group at `r`, get `(k+1)^2 + dp(l, r-1, 0)`.

4. **Option 2:** For each `i` where `boxes[i] == boxes[r]`, merge with the group: `dp(l, i, k+1) + dp(i+1, r-1, 0)`.

5. **Memoize:** Store results.

**Time Complexity:** O(n³)

**Space Complexity:** O(n³)
