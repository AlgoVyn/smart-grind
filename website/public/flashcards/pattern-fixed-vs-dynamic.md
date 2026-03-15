## Fixed Window vs Dynamic Window

**Question:** When should you use fixed-size sliding windows vs variable-size sliding windows?

<!-- front -->

---

## Answer: Know Your Problem Type

### Fixed Size Window
Window size is **predetermined** (given in problem).

```python
def fixed_window(arr, k):
    # Sum of every k consecutive elements
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum
```

### Dynamic Size Window
Window size **varies** to satisfy a condition.

```python
def dynamic_window(s, t):
    # Minimum window containing t
    need = {}
    for c in t:
        need[c] = need.get(c, 0) + 1
    
    have = {}
    required = len(need)
    formed = 0
    left = 0
    result = float('inf'), None, None
    
    for right in range(len(s)):
        # Expand window
        have[s[right]] = have.get(s[right], 0) + 1
        if s[right] in need and have[s[right]] == need[s[right]]:
            formed += 1
        
        # Shrink window while valid
        while formed == required:
            # Update answer
            if right - left + 1 < result[0]:
                result = (right - left + 1, left, right)
            
            # Contract from left
            have[s[left]] -= 1
            if s[left] in need and have[s[left]] < need[s[left]]:
                formed -= 1
            left += 1
    
    return s[result[1]:result[2]+1]
```

### Decision Guide

| Problem Type | Window Size | Example |
|--------------|-------------|---------|
| Maximum sum of k elements | Fixed | "Max sum of k consecutive" |
| Longest substring with k chars | Fixed | "Longest with exactly k distinct" |
| Minimum substring with all chars | Dynamic | "Minimum window substring" |
| Longest substring without repeating | Dynamic | "Length of longest substring" |

### ⚠️ Key Differences
| Fixed Window | Dynamic Window |
|--------------|----------------|
| `left` and `right` move together | `right` expands, `left` contracts |
| Size always = k | Size varies to satisfy condition |
| O(n) - one pass | O(2n) - at most 2n window moves |

### Template Pattern
```
Fixed:     right++, left = right - k + 1
Dynamic:   right++, shrink when valid, left++
```

<!-- back -->
