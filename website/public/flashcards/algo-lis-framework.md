## Title: LIS Framework

What is the standard framework for LIS problems?

<!-- front -->

---

### LIS Framework
```
LIS(nums[0..n-1]):
  
  // O(n²) DP Approach
  dp[i] = 1 for all i
  for i = 0 to n-1:
    for j = 0 to i-1:
      if nums[j] < nums[i]:
        dp[i] = max(dp[i], dp[j] + 1)
  return max(dp)
  
  // O(n log n) Binary Search Approach
  tails = empty list
  for num in nums:
    pos = lower_bound(tails, num)
    if pos == tails.length:
      tails.append(num)
    else:
      tails[pos] = num
  return tails.length
```

---

### Key Insight: Tails Array
```
tails[i] = minimum ending element of all increasing 
           subsequences of length i+1

Property: tails is always sorted (allows binary search)

When we see num:
- If num > all tails: extends longest IS
- Else: replaces first tail >= num (enables future extensions)
```

### Variation Handling
| Variant | Modification |
|---------|--------------|
| Strictly increasing | `bisect_left` (no equals) |
| Non-decreasing | `bisect_right` (allow equals) |
| Decreasing | Negate all or reverse comparison |
| Longest decreasing | Same with reversed comparison |

---

### Extensions
| Extension | Approach |
|-----------|----------|
| Reconstruction | Track parent pointers |
| Count LIS | DP with counting |
| k-LIS | Find kth longest IS |
| LIS with modifications | Weighted or constrained |

<!-- back -->
