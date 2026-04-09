## Two Pointers - Converging (Sorted Array Target Sum): Comparison

How do the different approaches for two sum problems compare?

<!-- front -->

---

### Approach Comparison

| Approach | Time | Space | Requires Sort? | Best For |
|----------|------|-------|----------------|----------|
| **Converging Two Pointers** | O(n) | O(1) | Yes | Sorted arrays, O(1) space needed |
| **Hash Map** | O(n) | O(n) | No | Unsorted arrays, need original indices |
| **Brute Force** | O(n²) | O(1) | No | Small inputs, verification |
| **Binary Search** | O(n log n) | O(1) | Yes | When one element fixed, search for other |

---

### Comparison by Scenario

```
Scenario 1: Sorted array, need O(1) space
┌────────────────────────────────────────────────────┐
│ Input: [2, 7, 11, 15], target = 9                   │
│                                                      │
│ Two Pointers:     O(n) = O(4) ≈ 4 ops          ✓✓✓  │
│ Hash Map:         O(n), O(n) space              ✓   │
│ Brute Force:      O(n²) = 16 ops                 ✗   │
│ Binary Search:    O(n log n) ≈ 8 ops            ✗   │
└────────────────────────────────────────────────────┘

Scenario 2: Unsorted array, need original indices
┌────────────────────────────────────────────────────┐
│ Input: [15, 2, 11, 7], target = 9                   │
│                                                      │
│ Hash Map:         O(n), O(n) space              ✓✓  │
│ Two Pointers:     Need to sort first           ✗   │
│                  (loses original indices)            │
│ Brute Force:      O(n²)                         ✗   │
└────────────────────────────────────────────────────┘

Scenario 3: Very large sorted array, memory constrained
┌────────────────────────────────────────────────────┐
│ Input: 10^7 elements, memory limit 1MB             │
│                                                      │
│ Two Pointers:     O(1) space, O(n) time        ✓✓✓  │
│ Hash Map:         O(n) space - may exceed limit  ✗  │
│ Binary Search:    O(1) space, O(n log n)        ✓   │
└────────────────────────────────────────────────────┘
```

---

### Implementation Comparison

```python
# Converging Two Pointers (Sorted)
def two_sum_pointers(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        s = numbers[left] + numbers[right]
        if s == target:
            return [left + 1, right + 1]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []

# Hash Map (Unsorted)
def two_sum_hash(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Binary Search (Sorted, alternative)
def two_sum_bs(numbers, target):
    for i in range(len(numbers)):
        complement = target - numbers[i]
        # Binary search for complement
        left, right = i + 1, len(numbers) - 1
        while left <= right:
            mid = (left + right) // 2
            if numbers[mid] == complement:
                return [i + 1, mid + 1]
            elif numbers[mid] < complement:
                left = mid + 1
            else:
                right = mid - 1
    return []
```

---

### When to Use Each

| Situation | Recommendation |
|-----------|---------------|
| Sorted array given | **Two Pointers** - Optimal O(n) time, O(1) space |
| Unsorted array, need original indices | **Hash Map** - O(n) time without sorting |
| Memory constrained + sorted | **Two Pointers** - Minimal space usage |
| Small n (< 100) | Any approach works |
| Teaching/Interview | **Two Pointers** - Shows understanding of sorted property |
| Production (Python) | `bisect` for binary search or built-ins |
| Finding ALL pairs | **Two Pointers** - Easier to skip duplicates |

---

### Space-Time Tradeoffs

```
┌─────────────────────────────────────────────────────────────┐
│                    SPACE vs TIME                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  O(1) space ◄────────────────────────────────────────────► O(n) space  │
│       │                                                    │    │
│       │    Two Pointers (sorted)                      Hash Map      │
│       │         │                                              │
│       │         │    Binary Search                            │
│       │         │         │                                    │
│       └─────────┴─────────┴────────────────────────────────────┘
│                                                              │
│  O(n²) time ◄────────────────────────────────────────────► O(n) time   │
│  (Brute Force)                                      (Optimal)        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

<!-- back -->
