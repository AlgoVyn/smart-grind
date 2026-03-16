## Longest Substring Without Repeating Characters

**Question:** Length of longest substring with unique chars?

<!-- front -->

---

## Answer: Sliding Window

### Solution
```python
def lengthOfLongestSubstring(s):
    char_index = {}
    max_length = 0
    left = 0
    
    for right, char in enumerate(s):
        # If char seen and is in current window
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length
```

### Visual: Sliding Window
```
s = "abcabcbb"

r=0: 'a' → window=[0,0], len=1
r=1: 'b' → window=[0,1], len=2
r=2: 'c' → window=[0,2], len=3
r=3: 'a' → seen at 0 ≥ left(0) → left=1
      window=[1,3], len=3
r=4: 'b' → seen at 2 ≥ left(1) → left=3
      window=[3,4], len=2
r=5: 'c' → seen at 3 ≥ left(3) → left=4
      window=[4,5], len=2
r=6: 'b' → seen at 4 ≥ left(4) → left=5
      window=[5,6], len=2
r=7: 'b' → seen at 5 ≥ left(5) → left=6
      window=[6,7], len=2

Max: 3 ("abc")
```

### ⚠️ Tricky Parts

#### 1. Why Move Left to char_index[char] + 1?
```python
# When we see repeated character:
# - Old occurrence is at position char_index[char]
# - New occurrence is at current position
# - Need to start AFTER old occurrence

# left = old_position + 1
```

#### 2. Why Use dict for Index?
```python
# O(1) lookup for character
# Stores most recent index of each character

# Alternative: use set and move left until no repeat
# But that's O(n) per move, total O(n²)
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Sliding Window | O(n) | O(min(n, alphabet)) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not updating left | left = char_index[char] + 1 |
| Checking all windows | Use sliding window |
| Wrong index storage | Store most recent index |

<!-- back -->
