## Longest Substring Without Repeating Characters

**Question:** Find length of longest substring without repeating characters.

<!-- front -->

---

## Answer: Sliding Window with HashMap

### Solution
```python
def lengthOfLongestSubstring(s):
    char_index = {}
    max_len = 0
    left = 0
    
    for right, char in enumerate(s):
        # If char seen and is in current window
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    
    return max_len
```

### Visual
```
s = "abcabcbb"

a b c a b c b b
↑         ↑
left    right

When right=3 (second 'a'):
  'a' was at index 0, which is >= left(0)
  Move left to 1

Window: "bca" length 3
```

### Complexity
- **Time:** O(n)
- **Space:** O(min(n, alphabet))

### Key Points
- Use dict to store last seen index
- Slide left when duplicate found
- Track maximum window size

<!-- back -->
