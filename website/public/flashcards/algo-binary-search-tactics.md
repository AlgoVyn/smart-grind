## Binary Search: Tactics & Tricks

What are the essential tactics for implementing correct and efficient binary search?

<!-- front -->

---

### Tactic 1: Avoid Integer Overflow

| Language | Problem | Solution |
|----------|---------|----------|
| **C++** | `mid = (L+R)/2` overflows | `mid = L + (R-L)/2` |
| **Java** | Same as C++ | Same fix |
| **Python** | No overflow issue | Can use `(L+R)//2` |

```python
# Safe in all languages
mid = left + (right - left) // 2

# Alternative for bitwise languages
mid = (left + right) >> 1
```

---

### Tactic 2: Boundary Pattern Selection

| Goal | Condition | Update |
|------|-----------|--------|
| **Find exact** | `left <= right` | `left = mid + 1` or `right = mid - 1` |
| **Lower bound** | `left < right` | `left = mid + 1` or `right = mid` |
| **Upper bound** | `left < right` | `left = mid + 1` or `right = mid` |

**Memory aid:**
- `while left <= right` → inclusive, use for exact search
- `while left < right` → exclusive, use for boundary

---
actic 3: Bisect Library Usage

Use Python's built-in for standard operations:

```python
import bisect

arr = [1, 2, 2, 2, 3, 4, 5]

bisect.bisect_left(arr, 2)   # 1 (first index >= 2)
bisect.bisect_right(arr, 2)  # 4 (first index > 2)
bisect.bisect(arr, 2)        # 4 (same as bisect_right)

# Insert maintaining sorted order
bisect.insort_left(arr, 2)   # Insert at leftmost position
bisect.insort_right(arr, 2)  # Insert at rightmost position
```

---

### Tactic 4: Floating Point Search

For continuous search spaces:

```python
def binary_search_float(predicate, left, right, eps=1e-9):
    """
    Find boundary where predicate changes
    """
    while right - left > eps:
        mid = (left + right) / 2
        if predicate(mid):
            right = mid
        else:
            left = mid
    
    return (left + right) / 2

# Fixed iterations for precision guarantee
def binary_search_fixed(predicate, left, right, iterations=100):
    for _ in range(iterations):
        mid = (left + right) / 2
        if predicate(mid):
            right = mid
        else:
            left = mid
    return (left + right) / 2
```

---

### Tactic 5: Debugging Binary Search

Test with minimal cases:

```python
def test_binary_search():
    test_cases = [
        [],                    # Empty
        [1],                   # Single element
        [1, 2],                # Two elements
        [1, 2, 3, 4, 5],       # Odd length
        [1, 2, 3, 4, 5, 6],    # Even length
        [1, 1, 1, 1],          # All same
        [1, 2, 2, 2, 3],       # Duplicates
    ]
    
    # Test each case with targets:
    # - Before array
    # - First element
    # - Middle element
    # - Last element
    # - After array
    # - Duplicates (first, middle, last)
```

**Common bug indicators:**
- Infinite loop → Check loop condition and updates
- Off-by-one → Test boundary cases
- Wrong answer → Verify predicate monotonicity

<!-- back -->
