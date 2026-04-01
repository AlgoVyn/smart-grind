## Title: LIS Tactics

What are the key implementation tactics for LIS?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| `bisect_left` for strict | Correctly handles duplicates |
| `bisect_right` for non-decreasing | Allows equals |
| Reverse for LDS | Reuse same code |
| Coordinate compression | Handle large values |

### Full Reconstruction
```python
def lis_reconstruct(nums):
    if not nums:
        return []
    
    n = len(nums)
    tails = []  # (value, index_in_nums)
    parent = [-1] * n  # parent[i] = index of predecessor
    
    for i, num in enumerate(nums):
        # Find position using bisect on values
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = (lo + hi) // 2
            if tails[mid][0] < num:
                lo = mid + 1
            else:
                hi = mid
        
        if lo > 0:
            parent[i] = tails[lo - 1][1]
        
        if lo == len(tails):
            tails.append((num, i))
        else:
            tails[lo] = (num, i)
    
    # Reconstruct
    result = []
    idx = tails[-1][1]  # last element of LIS
    while idx != -1:
        result.append(nums[idx])
        idx = parent[idx]
    
    return result[::-1]
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| bisect_left vs right | Wrong strictness | Match problem requirement |
| Empty array | Error | Return 0 or [] |
| Single element | Off by one | Handle n=1 |
| Reconstruction parent | Wrong index | Store original indices |
| Tails array content | Not actual LIS | Only length is correct |

### Library Functions
```python
# Python bisect module
bisect.bisect_left(a, x)   # first position >= x
bisect.bisect_right(a, x)  # first position > x
bisect.insort_left(a, x)   # insert maintaining order
```

<!-- back -->
