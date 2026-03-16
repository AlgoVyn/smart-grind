## Burst Balloons

**Question:** Maximum coins by bursting balloons in order?

<!-- front -->

---

## Answer: Interval DP

### Solution
```python
def maxCoins(nums):
    # Add virtual balloons at ends
    nums = [1] + [n for n in nums if n > 0] + [1]
    n = len(nums)
    
    # dp[i][j] = max coins for bursting balloons in (i, j)
    dp = [[0] * n for _ in range(n)]
    
    # Fill for increasing lengths
    for length in range(2, n):
        for left in range(0, n - length):
            right = left + length
            
            # Try bursting each balloon last
            for k in range(left + 1, right):
                dp[left][right] = max(
                    dp[left][right],
                    dp[left][k] + dp[k][right] + 
                    nums[left] * nums[k] * nums[right]
                )
    
    return dp[0][n - 1]
```

### Visual: Interval DP
```
nums = [3, 1, 5]

Extended: [1, 3, 1, 5, 1]

Consider bursting k last in range (0, 4):
k=1: coins = dp[0][1] + dp[1][4] + 1*3*1 = 0 + ? + 3
k=2: coins = dp[0][2] + dp[2][4] + 1*1*1 = 0 + 0 + 1
k=3: coins = dp[0][3] + dp[3][4] + 1*5*1 = 0 + 0 + 5

But we need smaller intervals first!
```

### ⚠️ Tricky Parts

#### 1. Why Add 1s at Ends?
```python
# Virtual balloons with value 1
# Simplifies boundary handling
# No balloon burst at position 0 or n-1
```

#### 2. Key Insight
```python
# When k bursts LAST in range (i, j):
# All balloons in (i, k) and (k, j) already burst
# Coins = nums[i] * nums[k] * nums[j]
# Plus dp[i][k] + dp[k][j]
```

#### 3. Bottom-up Order
```python
# Must fill for increasing interval lengths
# Because dp[i][j] depends on smaller intervals
# length = 2, 3, 4, ..., n-1
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Interval DP | O(n³) | O(n²) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not adding ends | Add 1 at both ends |
| Wrong range | left+1 to right-1 for k |
| Order | Fill by increasing length |

<!-- back -->
