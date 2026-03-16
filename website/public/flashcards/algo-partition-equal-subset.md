## Partition Equal Subset Sum

**Question:** Can you partition array into two subsets with equal sum?

<!-- front -->

---

## Answer: 0/1 Knapsack Variation

### Solution
```python
def canPartition(nums):
    total = sum(nums)
    
    # Odd sum can't be divided
    if total % 2 != 0:
        return False
    
    target = total // 2
    
    # Same as 0/1 knapsack
    dp = set([0])
    
    for num in nums:
        # Must iterate backwards
        dp = dp | {num + x for x in dp}
    
    return target in dp
```

### Visual: Subset Sum
```
nums = [1, 5, 11, 5]

Total = 22, target = 11

Step 0: dp = {0}
Step 1: num=1 → dp = {0, 1}
Step 2: num=5 → dp = {0, 1, 5, 6}
Step 3: num=11 → dp = {0, 1, 5, 6, 11, 12, 16, 17}
Step 4: num=5 → dp = {0, 1, 5, 6, 10, 11, 12, 15, 16, 17, ...}

target(11) in dp → True!

Partition: [11] and [1, 5, 5]
```

### ⚠️ Tricky Parts

#### 1. Why Subset Sum Works
```python
# If we can form sum = target using subset of nums
# Then remaining elements also sum to target
# (because total = 2 × target)

# So just find if any subset sums to target
```

#### 2. Bitmask Approach
```python
# Use bitset for efficient subset sum
def canPartitionBit(nums):
    total = sum(nums)
    if total % 2:
        return False
    
    target = total // 2
    bits = 1  # bit 0 set
    
    for num in nums:
        bits |= bits << num
    
    return (bits >> target) & 1 == 1
```

#### 3. 2D DP Alternative
```python
def canPartitionDP(nums):
    total = sum(nums)
    if total % 2:
        return False
    
    target = total // 2
    n = len(nums)
    
    dp = [[False] * (target + 1) for _ in range(n + 1)]
    
    # Base case
    for i in range(n + 1):
        dp[i][0] = True
    
    for i in range(1, n + 1):
        for j in range(1, target + 1):
            if nums[i-1] <= j:
                dp[i][j] = dp[i-1][j] or dp[i-1][j-nums[i-1]]
            else:
                dp[i][j] = dp[i-1][j]
    
    return dp[n][target]
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Set DP | O(n × sum) | O(sum) |
| Bitmask | O(n × sum / word) | O(sum) |
| 2D DP | O(n × sum) | O(n × sum) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not checking odd sum | Return False early |
| Forward iteration | Use backward for 2D, new set for 1D |
| Wrong target | target = sum // 2 |

<!-- back -->
