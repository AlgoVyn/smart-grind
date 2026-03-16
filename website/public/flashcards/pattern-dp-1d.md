## DP: 1D Array Pattern (Fibonacci Style)

**Question:** How do you recognize and solve 1D DP problems?

<!-- front -->

---

## Answer: Identify the Recurrence Relation

### Template
```python
def solve(nums):
    # Base case
    dp = [0] * len(nums)
    dp[0] = nums[0]
    
    # Build solution
    for i in range(1, len(nums)):
        # Recurrence: dp[i] = max/min(dp[i-1], dp[i-2], ...)
        dp[i] = max(dp[i-1] + nums[i], nums[i])
        # or: dp[i] = max(dp[i-1], dp[i-2])
    
    return dp[-1]
```

### Visual: Recurrence Patterns
```
Fibonacci:      dp[i] = dp[i-1] + dp[i-2]
House Robber:   dp[i] = max(dp[i-1], dp[i-2] + nums[i])
Climbing Stairs:dp[i] = dp[i-1] + dp[i-2]
Decode Ways:    dp[i] = depends on s[i-1], s[i-2]
```

### ⚠️ Tricky Parts

#### 1. Identifying 1D DP
Look for:
- "Maximum/Minimum" result
- Array/string with sequential decisions
- Each element affects future decisions
- Can't skip base cases

#### 2. Off-by-One in Index
```python
# Common: dp size mismatch
dp = [0] * len(nums)    # Size n
dp[0] = nums[0]         # First element

# For climbing stairs: dp[0]=1, dp[1]=2
# For house robber: can choose first or second

# ALWAYS check base cases
if len(nums) == 0:
    return 0
if len(nums) == 1:
    return nums[0]
```

#### 3. Recurrence Variations

| Pattern | Recurrence | Problem |
|---------|-----------|---------|
| Max subarray | dp[i] = max(dp[i-1]+a[i], a[i]) | Kadane |
| House Robber | dp[i] = max(dp[i-1], dp[i-2]+a[i]) | Rob |
| Climbing | dp[i] = dp[i-1] + dp[i-2] | Stairs |
| Buy/Sell | dp[i] = max(dp[i-1], price[i]-min_price) | Stock |

#### 4. Space Optimization
```python
# 1D DP: O(n) space
dp = [0] * n
dp[i] = dp[i-1] + dp[i-2]

# Can optimize to O(1)!
prev2, prev1 = 0, 1  # or first two values
for i in range(n):
    curr = prev1 + prev2
    prev2 = prev1
    prev1 = curr
```

### House Robber Example
```python
def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # dp[i] = max money robbing up to house i
    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        # Don't rob: dp[i-1]
        # Rob: dp[i-2] + nums[i]
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    
    return dp[-1]

# Space optimized
def rob(nums):
    if not nums:
        return 0
    
    prev2, prev1 = 0, nums[0]
    
    for i in range(1, len(nums)):
        curr = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = curr
    
    return prev1
```

### When NOT to Use 1D DP
- Need to track multiple states (use 2D)
- Decisions involve more than previous 1-2 states
- Need to consider all possible previous states

### Common Mistakes

| Mistake | Symptom | Fix |
|---------|---------|-----|
| Wrong base | IndexError | Check len first |
| Wrong recurrence | Wrong answer | Draw recurrence tree |
| Not considering all cases | Missing edge | Check single/double element |

<!-- back -->
