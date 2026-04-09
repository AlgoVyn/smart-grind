## Two Pointers - String Reversal: Tactics

What are the advanced techniques for string reversal?

<!-- front -->

---

### Tactic 1: Three-Reverse Rotation Pattern

**Problem**: Rotate array efficiently

**Solution**: Reverse three times

```python
def rotate_array(nums, k):
    """Rotate right by k using three reverses."""
    n = len(nums)
    k = k % n
    
    def reverse(left, right):
        while left < right:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
            right -= 1
    
    # Reverse all: [1,2,3,4,5,6,7] → [7,6,5,4,3,2,1]
    reverse(0, n - 1)
    # Reverse first k: [7,6,5,4,3,2,1] → [5,6,7,4,3,2,1]
    reverse(0, k - 1)
    # Reverse rest: [5,6,7,4,3,2,1] → [5,6,7,1,2,3,4]
    reverse(k, n - 1)
```

**Why it works**: Reversing brings elements to correct relative positions

---

### Tactic 2: In-Place Without Extra Space

**Strings in Python are immutable**, so we need char array:

```python
def reverse_inplace(s):
    """For mutable strings (C++ char array)."""
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
    # No return needed - modified in-place
```

**C++ version**:
```cpp
void reverseString(vector<char>& s) {
    int left = 0, right = s.size() - 1;
    while (left < right) {
        swap(s[left++], s[right--]);
    }
}
```

---

### Tactic 3: Skip Non-Alphanumeric

```python
def reverse_alphanumeric(s):
    chars = list(s)
    left, right = 0, len(chars) - 1
    
    while left < right:
        while left < right and not chars[left].isalnum():
            left += 1
        while left < right and not chars[right].isalnum():
            right -= 1
        
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    
    return ''.join(chars)
```

**Pattern**: Move pointers until valid swap positions found

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Immutable strings** | Can't modify Python string | Convert to list first |
| **Integer division** | Odd length center | left < right handles both |
| **Not converting back** | Return list instead of string | ''.join() |
| **Pointer crossover** | left > right condition | Use left < right |
| **Extra spaces** | Word reversal artifacts | Handle spaces carefully |

---

### Tactic 5: Recursive Reversal

```python
def reverse_recursive(s):
    """Educational - not optimal for production."""
    if len(s) <= 1:
        return s
    return reverse_recursive(s[1:]) + s[0]
```

**Space**: O(n) for recursion stack
**Time**: O(n²) due to string concatenation

**Better recursive with char array**:
```python
def reverse_recursive_helper(chars, left, right):
    if left >= right:
        return
    chars[left], chars[right] = chars[right], chars[left]
    reverse_recursive_helper(chars, left + 1, right - 1)
```

---

### Tactic 6: Reverse Integer

```python
def reverse_integer(x):
    """Reverse digits of 32-bit signed integer."""
    result = 0
    is_negative = x < 0
    x = abs(x)
    
    while x > 0:
        digit = x % 10
        result = result * 10 + digit
        x //= 10
    
    # Check overflow
    if result > 2**31 - 1:
        return 0
    
    return -result if is_negative else result
```

<!-- back -->
