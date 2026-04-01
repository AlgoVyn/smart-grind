## Partition Equal Subset: Framework

What are the complete implementations for partition equal subset sum?

<!-- front -->

---

### 1D DP (Space Optimized)

```python
def can_partition(nums):
    """
    Determine if array can be partitioned into two equal sum subsets.
    Time: O(n * target), Space: O(target)
    """
    total = sum(nums)
    
    # Must be even to partition
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # dp[s] = True if sum s is achievable
    dp = [False] * (target + 1)
    dp[0] = True  # Empty subset has sum 0
    
    for num in nums:
        # Iterate backwards to avoid using updated values
        for s in range(target, num - 1, -1):
            dp[s] = dp[s] or dp[s - num]
    
    return dp[target]
```

---

### With Path Reconstruction

```python
def can_partition_with_path(nums):
    """
    Return the actual partition if possible.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False, [], []
    
    target = total // 2
    n = len(nums)
    
    # dp[i][s] = True if first i elements can make sum s
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    dp[0][0] = True
    
    for i in range(1, n + 1):
        num = nums[i - 1]
        for s in range(target + 1):
            dp[i][s] = dp[i-1][s]  # Don't take
            if s >= num and dp[i-1][s - num]:
                dp[i][s] = True  # Take
    
    if not dp[n][target]:
        return False, [], []
    
    # Backtrack to find partition
    subset1, subset2 = [], []
    s = target
    for i in range(n, 0, -1):
        if s >= nums[i-1] and dp[i-1][s - nums[i-1]]:
            subset1.append(nums[i-1])
            s -= nums[i-1]
        else:
            subset2.append(nums[i-1])
    
    return True, subset1, subset2
```

---

### Bitset Optimization

```python
def can_partition_bitset(nums):
    """
    Use bitset for very fast subset sum computation.
    Each bit represents whether a sum is achievable.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # bitset: bit i is 1 if sum i is achievable
    bitset = 1  # Only sum 0 is achievable initially
    
    for num in nums:
        # Shift left by num and OR with original
        bitset |= bitset << num
        
        # Early exit if target achievable
        if bitset & (1 << target):
            return True
    
    return bool(bitset & (1 << target))
```

---

### Recursive with Memoization

```python
def can_partition_recursive(nums):
    """
    Top-down recursive approach with memoization.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    n = len(nums)
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dfs(i, remaining):
        """Can achieve remaining sum using elements from i onwards?"""
        if remaining == 0:
            return True
        if i >= n or remaining < 0:
            return False
        
        # Try taking or skipping nums[i]
        return dfs(i + 1, remaining - nums[i]) or dfs(i + 1, remaining)
    
    return dfs(0, target)
```

---

### Meet-in-the-Middle (Large n)

```python
def can_partition_meet_middle(nums):
    """
    For large n (n > 30), use meet-in-the-middle.
    Split array, compute all subset sums for each half.
    """
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    def get_subset_sums(arr):
        """Generate all possible subset sums"""
        sums = [0]
        for num in arr:
            new_sums = [s + num for s in sums]
            sums.extend(new_sums)
        return set(sums)
    
    mid = len(nums) // 2
    left_sums = get_subset_sums(nums[:mid])
    right_sums = get_subset_sums(nums[mid:])
    
    # Check if any combination reaches target
    for s in left_sums:
        if target - s in right_sums:
            return True
    
    return False
```

<!-- back -->
