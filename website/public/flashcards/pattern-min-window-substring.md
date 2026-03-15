## Minimum Window Substring

**Question:** How do you find the minimum window in string s that contains all characters of string t?

<!-- front -->

---

## Answer: Sliding Window with Two Pointers

### Problem
Given strings `s` and `t`, find the smallest substring in `s` that contains all characters of `t`.

### Solution
```python
def min_window(s, t):
    if not s or not t:
        return ""
    
    # Count required characters
    need = {}
    for c in t:
        need[c] = need.get(c, 0) + 1
    
    # Window state
    have = {}
    required = len(need)
    formed = 0
    
    # Sliding window
    left = 0
    result = float('inf'), None, None
    
    for right in range(len(s)):
        char = s[right]
        have[char] = have.get(char, 0) + 1
        
        # Check if this char completes a requirement
        if char in need and have[char] == need[char]:
            formed += 1
        
        # Try to shrink window
        while formed == required:
            # Update result
            if right - left + 1 < result[0]:
                result = (right - left + 1, left, right)
            
            # Remove left char
            left_char = s[left]
            if left_char in need and have[left_char] == need[left_char]:
                formed -= 1
            have[left_char] -= 1
            left += 1
    
    return s[result[1]:result[2]+1] if result[1] else ""
```

### Visual
```
s = "ADOBECODEBANC", t = "ABC"

Step 1: "ADOBEC" has A,B,C ✓ (length 6)
Step 2: "CODEBA" has A,B,C ✓ (length 5) 
Step 3: "BANC" has A,B,C ✓ (length 4) ← Answer!
```

### Complexity
- **Time:** O(|s| + |t|)
- **Space:** O(|s| + |t|)

### Key Patterns
| Pattern | Use When |
|---------|----------|
| Shrink left when valid | Finding minimum window |
| Expand right for solution | Always |
| Count match with dict | String problems |

### ⚠️ Common Mistakes
- Forgetting to update `formed` counter
- Not shrinking window enough
- Returning wrong substring

<!-- back -->
