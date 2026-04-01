## Partition Equal Subset: Tactics & Techniques

What are the tactical patterns for partition subset sum problems?

<!-- front -->

---

### Tactic 1: Early Termination

Stop early if target becomes impossible or is reached.

```python
def can_partition_early_stop(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for s in range(target, num - 1, -1):
            if not dp[s] and dp[s - num]:
                dp[s] = True
                if s == target:  # Early exit!
                    return True
    
    return dp[target]
```

---

### Tactic 2: Sorting for Pruning

Sort descending to handle large numbers first (better pruning).

```python
def partition_with_sorting(nums, k):
    nums.sort(reverse=True)  # Largest first
    
    # For backtracking: reduces branching factor
    # For DP: no effect on correctness
    
    # Also check: if any num > target, impossible
    target = sum(nums) // k
    if nums[0] > target:
        return False
```

---

### Tactic 3: Bitset for Speed

Use bit manipulation for significant speedup.

```python
def partition_bitset_fast(nums):
    total = sum(nums)
    if total & 1:  # Odd check using bit
        return False
    
    target = total >> 1  # Divide by 2 using shift
    
    achievable = 1  # Bit 0 is set
    for num in nums:
        achievable |= achievable << num
        if (achievable >> target) & 1:
            return True
    
    return (achievable >> target) & 1
```

**Speed**: 10-50x faster than array DP for dense cases.

---

### Tactic 4: Space Compression

Optimize 2D DP to 1D when only previous row needed.

```python
# Before: O(n * target) space
dp = [[False] * (target + 1) for _ in range(n + 1)]

# After: O(target) space
dp = [False] * (target + 1)

# Key: iterate backwards!
for num in nums:
    for s in range(target, num - 1, -1):
        dp[s] = dp[s] or dp[s - num]
```

---

### Tactic 5: Meet-in-the-Middle for Large Input

When n > 30 and target is large:

```python
def partition_large_n(nums):
    """Handle n > 30 where O(n * target) is too slow"""
    if len(nums) <= 30:
        return standard_dp(nums)
    
    # Split and use meet-in-the-middle
    mid = len(nums) // 2
    left, right = nums[:mid], nums[mid:]
    
    left_sums = all_subset_sums(left)
    right_sums = all_subset_sums(right)
    
    # Check combinations
    target = sum(nums) // 2
    for s in left_sums:
        if target - s in right_sums:
            return True
    return False
```

**Complexity**: O(2^(n/2)) instead of O(n * target).

<!-- back -->
