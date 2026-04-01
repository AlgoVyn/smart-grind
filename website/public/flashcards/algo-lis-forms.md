## Title: LIS Forms

What are the different forms and variations of LIS problems?

<!-- front -->

---

### LIS Variations
| Variation | Condition | Binary Search |
|-----------|-----------|---------------|
| Strictly increasing | a[i] < a[j] | bisect_left |
| Non-decreasing | a[i] <= a[j] | bisect_right |
| Strictly decreasing | a[i] > a[j] | Negate, bisect_left |
| Non-increasing | a[i] >= a[j] | Negate, bisect_right |

### Count of LIS
```python
def count_lis(nums):
    """Count number of longest increasing subsequences"""
    if not nums:
        return 0
    
    n = len(nums)
    dp = [1] * n  # length of LIS ending at i
    count = [1] * n  # count of LIS ending at i
    
    max_len = 1
    total = 0
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                if dp[j] + 1 > dp[i]:
                    dp[i] = dp[j] + 1
                    count[i] = count[j]
                elif dp[j] + 1 == dp[i]:
                    count[i] += count[j]
        
        if dp[i] > max_len:
            max_len = dp[i]
            total = count[i]
        elif dp[i] == max_len:
            total += count[i]
    
    return total
```

---

### LIS with Coordinate Compression
```python
def lis_compressed(nums):
    """When values are large, compress to ranks"""
    sorted_unique = sorted(set(nums))
    rank = {v: i for i, v in enumerate(sorted_unique)}
    
    compressed = [rank[x] for x in nums]
    
    # Now apply standard LIS O(n log n)
    # on compressed values (0 to len-1)
    tails = []
    for num in compressed:
        idx = bisect.bisect_left(tails, num)
        if idx == len(tails):
            tails.append(num)
        else:
            tails[idx] = num
    
    return len(tails)
```

---

### LDS (Longest Decreasing Subsequence)
```python
def lds(nums):
    """Reverse comparison or negate"""
    tails = []
    for num in reversed(nums):  # process in reverse
        idx = bisect.bisect_left(tails, num)
        if idx == len(tails):
            tails.append(num)
        else:
            tails[idx] = num
    return len(tails)
```

<!-- back -->
