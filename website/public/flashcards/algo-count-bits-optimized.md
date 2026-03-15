## Count Bits - DP Optimization

**Question:** How can you compute counts in O(n) without bit operations per number?

<!-- front -->

---

## Count Bits: DP Approach

### Naive: O(n × log n)
```python
def count_bits_naive(n):
    result = []
    for num in range(n + 1):
        count = 0
        while num:
            count += num & 1
            num >>= 1
        result.append(count)
    return result
```

### Optimized: O(n)
```python
def count_bits_dp(n):
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # i >> 1 removes LSB, dp[i >> 1] is count without LSB
        # i & 1 is the LSB
        dp[i] = dp[i >> 1] + (i & 1)
    
    return dp
```

### Why This Works
```
For i = 5 (binary: 101):
- i >> 1 = 2 (binary: 10)
- dp[2] = 1 (one 1 in 10)
- i & 1 = 1 (LSB is 1)
- dp[5] = dp[2] + 1 = 1 + 1 = 2 ✓
```

### Even Better: Using Lowest Set Bit
```python
def count_bits(n):
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # i & (i-1) clears lowest set bit
        dp[i] = dp[i & (i-1)] + 1
    
    return dp
```

### Complexity
- **Time:** O(n)
- **Space:** O(n)

<!-- back -->
