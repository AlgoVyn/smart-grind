## House Robber

**Question:** Maximum money robbed without robbing adjacent houses?

<!-- front -->

---

## Answer: Dynamic Programming

### Solution
```python
def rob(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # dp[i] = max money up to house i
    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        dp[i] = max(
            dp[i-1],              # Skip current
            dp[i-2] + nums[i]    # Rob current
        )
    
    return dp[-1]
```

### Visual: DP Progression
```
nums = [2, 7, 9, 3, 1]

i=0: dp[0] = 2
i=1: dp[1] = max(2, 7) = 7
i=2: dp[2] = max(7, 2+9) = 11
i=3: dp[3] = max(11, 7+3) = 11
i=4: dp[4] = max(11, 11+1) = 12

Answer: 12 (houses 0, 2, 4)
```

### ⚠️ Tricky Parts

#### 1. Space Optimization
```python
# Only need previous two values
def robOptimized(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2 = nums[0]
    prev1 = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1
```

#### 2. House Robber II (Circular)
```python
# Houses in circle, can't rob first and last
def rob2(nums):
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Either exclude first or last house
    def robLinear(nums):
        prev2 = 0
        prev1 = 0
        for num in nums:
            current = max(prev1, prev2 + num)
            prev2 = prev1
            prev1 = current
        return prev1
    
    return max(robLinear(nums[:-1]), robLinear(nums[1:]))
```

#### 3. House Robber III (Tree)
```python
# Binary tree houses, can't rob adjacent
def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # (rob, not_rob)
        not_rob = max(left) + max(right)
        rob = node.val + left[1] + right[1]
        
        return (not_rob, rob)
    
    return max(dfs(root))
```

### Time & Space Complexity

| Version | Time | Space |
|---------|------|-------|
| Standard | O(n) | O(n) |
| Optimized | O(n) | O(1) |
| Circular | O(n) | O(1) |
| Tree | O(n) | O(h) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong recurrence | dp[i] = max(skip, take) |
| Edge cases | Handle len=0,1 |
| Forgetting prev2 | Need two variables |

<!-- back -->
