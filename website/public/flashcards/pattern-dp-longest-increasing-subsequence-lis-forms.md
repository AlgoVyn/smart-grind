## DP - Longest Increasing Subsequence (LIS): Forms

What are the different forms and variations of LIS problems?

<!-- front -->

---

### Problem Variations

| Variant | Description | Modification |
|---------|-------------|--------------|
| **Basic LIS** | Standard LIS | None |
| **Non-decreasing** | Allow equal elements | Use `<=` or `bisect_right` |
| **Decreasing (LDS)** | Longest decreasing | Negate values or reverse comparison |
| **Bitonic** | Inc then dec | LIS from left + LIS from right |
| **Count LIS** | Number of LIS | Track count alongside dp |
| **2D LIS** | Russian doll envelopes | Sort + LIS on second dimension |
| **Divisible subset** | LIS with divisibility | Sort + modified condition |
| **Constrained LIS** | Sum constraint | Modified DP state |

---

### Form 1: Non-Decreasing (Allow Duplicates)

```python
def length_of_lds(nums):  # Longest Non-Decreasing
    """
    Use <= for comparison
    """
    if not nums:
        return 0
    
    n = len(nums)
    dp = [1] * n
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] <= nums[i]:  # Changed from < to <=
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

# Binary search version
import bisect
def length_of_lds_fast(nums):
    tails = []
    for num in nums:
        idx = bisect.bisect_right(tails, num)  # Changed from bisect_left
        if idx == len(tails):
            tails.append(num)
        else:
            tails[idx] = num
    return len(tails)
```

---

### Form 2: Count of LIS

```python
def find_number_of_lis(nums):
    """
    LeetCode 673: Count number of longest increasing subsequences
    """
    n = len(nums)
    if n == 0:
        return 0
    
    dp = [1] * n      # Length of LIS ending at i
    count = [1] * n   # Count of LIS ending at i
    
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                if dp[j] + 1 > dp[i]:
                    dp[i] = dp[j] + 1
                    count[i] = count[j]
                elif dp[j] + 1 == dp[i]:
                    count[i] += count[j]
    
    max_len = max(dp)
    result = sum(count[i] for i in range(n) if dp[i] == max_len)
    return result

# Example: [1, 3, 5, 4, 7]
# LIS length: 4 (1, 3, 4, 7 or 1, 3, 5, 7)
# Count: 2
```

---

### Form 3: 2D LIS (Russian Doll Envelopes)

```python
def max_envelopes(envelopes):
    """
    LeetCode 354: Russian Doll Envelopes
    Sort by width, then LIS on height (strict)
    """
    if not envelopes:
        return 0
    
    # Sort: width ascending, height descending for same width
    # (prevents counting same-width envelopes)
    envelopes.sort(key=lambda x: (x[0], -x[1]))
    
    # LIS on heights
    heights = [h for _, h in envelopes]
    
    # Binary search LIS
    tails = []
    for h in heights:
        idx = bisect.bisect_left(tails, h)
        if idx == len(tails):
            tails.append(h)
        else:
            tails[idx] = h
    
    return len(tails)
```

---

### Form 4: Largest Divisible Subset

```python
def largest_divisible_subset(nums):
    """
    Sort first, then LIS with divisibility condition
    """
    if not nums:
        return []
    
    nums.sort()
    n = len(nums)
    
    dp = [1] * n
    parent = [-1] * n
    
    max_len, max_idx = 0, 0
    
    for i in range(n):
        for j in range(i):
            if nums[i] % nums[j] == 0:  # Divisibility condition
                if dp[j] + 1 > dp[i]:
                    dp[i] = dp[j] + 1
                    parent[i] = j
        
        if dp[i] > max_len:
            max_len = dp[i]
            max_idx = i
    
    # Reconstruct
    result = []
    while max_idx != -1:
        result.append(nums[max_idx])
        max_idx = parent[max_idx]
    
    return result[::-1]
```

---

### Form 5: Longest Bitonic Subsequence

```python
def longest_bitonic_subsequence(nums):
    """
    First increasing, then decreasing
    """
    n = len(nums)
    if n == 0:
        return 0
    
    # LIS from left
    lis_left = [1] * n
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                lis_left[i] = max(lis_left[i], lis_left[j] + 1)
    
    # LIS from right (reverse)
    lis_right = [1] * n
    for i in range(n - 1, -1, -1):
        for j in range(n - 1, i, -1):
            if nums[j] < nums[i]:  # Decreasing from i to j
                lis_right[i] = max(lis_right[i], lis_right[j] + 1)
    
    # Combine: bitonic at i = lis_left[i] + lis_right[i] - 1
    max_bitonic = 0
    for i in range(n):
        max_bitonic = max(max_bitonic, lis_left[i] + lis_right[i] - 1)
    
    return max_bitonic
```

---

### Form 6: LIS with Pair Chain

```python
def find_longest_chain(pairs):
    """
    LeetCode 646: Maximum Length of Pair Chain
    Similar to LIS on pairs
    """
    # Sort by first element
    pairs.sort()
    
    n = len(pairs)
    dp = [1] * n
    
    for i in range(n):
        for j in range(i):
            if pairs[j][1] < pairs[i][0]:  # Chain condition
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)
```

<!-- back -->
