## Binary Search - Find First/Last Occurrence: Comparison

How do the different approaches for finding first/last occurrence compare?

<!-- front -->

---

### Approach Comparison

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| **Two Binary Searches** | O(log n) | O(1) | Optimal, clean, educational | Two passes through array |
| **Built-in Functions** | O(log n) | O(1) | Concise, production-ready | Language-dependent |
| **Single BS + Linear Scan** | O(log n + k) | O(1) | Single pass concept | Poor with many duplicates |

**k** = number of occurrences of target

---

### Comparison by Scenario

```
Scenario 1: Target appears once or not at all
┌────────────────────────────────────────────────────┐
│ Array: [1, 3, 5, 7, 9], target = 5 or 6             │
│                                                      │
│ Two Binary Searches:  2 × O(log n) = O(log n)  ✓     │
│ Built-in Functions:   O(log n)                     ✓ │
│ BS + Linear:          O(log n) (k is 0 or 1)      ✓  │
└────────────────────────────────────────────────────┘

Scenario 2: Target appears many times
┌────────────────────────────────────────────────────┐
│ Array: [5,5,5,5,5,5,5,5,5,5] (10×), target = 5      │
│                                                      │
│ Two Binary Searches:  O(log n) = O(log 10)       ✓✓ │
│ Built-in Functions:   O(log n)                   ✓✓ │
│ BS + Linear:          O(log n + 10) = O(n)       ✗  │
└────────────────────────────────────────────────────┘

Scenario 3: Very large array, sparse target
┌────────────────────────────────────────────────────┐
│ Array: 10^6 elements, target at random position   │
│                                                      │
│ Two Binary Searches:  O(log 10^6) ≈ 20 ops       ✓✓ │
│ Built-in Functions:   O(log 10^6) ≈ 20 ops       ✓✓ │
│ BS + Linear:          Unpredictable (k unknown)   ? │
└────────────────────────────────────────────────────┘
```

---

### Implementation Comparison

```python
# Two Binary Searches (Manual)
def find_first_manual(nums, target):
    low, high = 0, len(nums) - 1
    first = -1
    while low <= high:
        mid = low + (high - low) // 2
        if nums[mid] >= target:     # Key: >=
            if nums[mid] == target:
                first = mid
            high = mid - 1
        else:
            low = mid + 1
    return first

# Built-in (Python)
import bisect
def find_first_builtin(nums, target):
    idx = bisect.bisect_left(nums, target)
    if idx < len(nums) and nums[idx] == target:
        return idx
    return -1

# Built-in returns position to insert, so check validity!
```

---

### When to Use Each

| Situation | Recommendation |
|-----------|---------------|
| Coding interview | Two Binary Searches (shows understanding) |
| Production code | Built-in functions (tested, optimized) |
| Educational purposes | Two Binary Searches (learn the pattern) |
| Very tight constraints | Two Binary Searches (predictable performance) |
| Quick prototyping | Built-in functions (fewer bugs) |

<!-- back -->
